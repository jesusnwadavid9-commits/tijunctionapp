import { firestore, storage } from '@/firebase/config';
import {
  conversationsRef,
  conversationDoc,
  messagesRef,
} from '@/firebase/collections';
import { conversationFromDoc, messageFromDoc } from '@/firebase/converters';
import type { Conversation, Message, MessageType } from '@/types';

export async function getOrCreateConversation(
  userId1: string,
  userId2: string,
): Promise<Conversation> {
  const participants = [userId1, userId2].sort();

  const snapshot = await conversationsRef()
    .where('participants', '==', participants)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    return conversationFromDoc(snapshot.docs[0]);
  }

  const now = firestore.FieldValue.serverTimestamp();
  const ref = conversationsRef().doc();
  await ref.set({
    participants,
    lastMessage: '',
    lastMessageAt: now,
    lastMessageSenderId: '',
    typing: {},
    createdAt: now,
    updatedAt: now,
  });

  const snap = await ref.get();
  return conversationFromDoc(snap);
}

export async function getUserConversations(
  userId: string,
): Promise<Conversation[]> {
  const snapshot = await conversationsRef()
    .where('participants', 'array-contains', userId)
    .orderBy('lastMessageAt', 'desc')
    .get();

  return snapshot.docs.map(conversationFromDoc);
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  type: MessageType = 'text',
  mediaUrl: string | null = null,
): Promise<Message> {
  const now = firestore.FieldValue.serverTimestamp();
  const ref = messagesRef(conversationId).doc();

  await ref.set({
    conversationId,
    senderId,
    content,
    type,
    mediaUrl,
    readBy: { [senderId]: now },
    isDeleted: false,
    createdAt: now,
  });

  await conversationDoc(conversationId).update({
    lastMessage: type === 'text' ? content : `Sent a ${type}`,
    lastMessageAt: now,
    lastMessageSenderId: senderId,
    updatedAt: now,
  });

  const snap = await ref.get();
  return messageFromDoc(snap);
}

export async function markMessageAsRead(
  conversationId: string,
  messageId: string,
  userId: string,
): Promise<void> {
  await messagesRef(conversationId)
    .doc(messageId)
    .update({
      [`readBy.${userId}`]: firestore.FieldValue.serverTimestamp(),
    });
}

export async function setTypingIndicator(
  conversationId: string,
  userId: string,
  isTyping: boolean,
): Promise<void> {
  await conversationDoc(conversationId).update({
    [`typing.${userId}`]: isTyping,
  });
}

export async function uploadMessageMedia(
  conversationId: string,
  uri: string,
  type: 'image' | 'video',
): Promise<string> {
  const ext = type === 'image' ? 'jpg' : 'mp4';
  const filename = `${Date.now()}.${ext}`;
  const ref = storage().ref(`messages/${conversationId}/${filename}`);
  await ref.putFile(uri);
  return ref.getDownloadURL();
}
