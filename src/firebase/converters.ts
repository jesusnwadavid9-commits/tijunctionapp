import {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import type { User, Post, Comment, Conversation, Message, AppNotification } from '@/types';

type DocumentSnapshot = FirebaseFirestoreTypes.DocumentSnapshot;

const toDate = (val: unknown): Date => {
  if (val && typeof val === 'object' && 'toDate' in val) {
    return (val as { toDate: () => Date }).toDate();
  }
  return new Date();
};

export function userFromDoc(doc: DocumentSnapshot): User {
  const d = doc.data()!;
  return {
    id: doc.id,
    email: d.email ?? '',
    displayName: d.displayName ?? '',
    bio: d.bio ?? '',
    profilePhotoUrl: d.profilePhotoUrl ?? '',
    coverPhotoUrl: d.coverPhotoUrl ?? '',
    followersCount: d.followersCount ?? 0,
    followingCount: d.followingCount ?? 0,
    postsCount: d.postsCount ?? 0,
    isVerified: d.isVerified ?? false,
    isOnline: d.isOnline ?? false,
    lastSeen: toDate(d.lastSeen),
    fcmTokens: d.fcmTokens ?? [],
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

export function postFromDoc(doc: DocumentSnapshot): Post {
  const d = doc.data()!;
  return {
    id: doc.id,
    authorId: d.authorId ?? '',
    authorName: d.authorName ?? '',
    authorPhotoUrl: d.authorPhotoUrl ?? '',
    type: d.type ?? 'text',
    content: d.content ?? '',
    imageUrls: d.imageUrls ?? [],
    videoUrl: d.videoUrl ?? '',
    thumbnailUrl: d.thumbnailUrl ?? '',
    likesCount: d.likesCount ?? 0,
    commentsCount: d.commentsCount ?? 0,
    sharesCount: d.sharesCount ?? 0,
    savesCount: d.savesCount ?? 0,
    tags: d.tags ?? [],
    isDeleted: d.isDeleted ?? false,
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

export function commentFromDoc(doc: DocumentSnapshot): Comment {
  const d = doc.data()!;
  return {
    id: doc.id,
    postId: d.postId ?? '',
    authorId: d.authorId ?? '',
    authorName: d.authorName ?? '',
    authorPhotoUrl: d.authorPhotoUrl ?? '',
    content: d.content ?? '',
    parentId: d.parentId ?? null,
    likesCount: d.likesCount ?? 0,
    isDeleted: d.isDeleted ?? false,
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

export function conversationFromDoc(doc: DocumentSnapshot): Conversation {
  const d = doc.data()!;
  return {
    id: doc.id,
    participants: d.participants ?? [],
    lastMessage: d.lastMessage ?? '',
    lastMessageAt: toDate(d.lastMessageAt),
    lastMessageSenderId: d.lastMessageSenderId ?? '',
    typing: d.typing ?? {},
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

export function messageFromDoc(doc: DocumentSnapshot): Message {
  const d = doc.data()!;
  return {
    id: doc.id,
    conversationId: d.conversationId ?? '',
    senderId: d.senderId ?? '',
    content: d.content ?? '',
    type: d.type ?? 'text',
    mediaUrl: d.mediaUrl ?? null,
    readBy: Object.fromEntries(
      Object.entries(d.readBy ?? {}).map(([k, v]) => [k, toDate(v)]),
    ),
    isDeleted: d.isDeleted ?? false,
    createdAt: toDate(d.createdAt),
  };
}

export function notificationFromDoc(doc: DocumentSnapshot): AppNotification {
  const d = doc.data()!;
  return {
    id: doc.id,
    recipientId: d.recipientId ?? '',
    senderId: d.senderId ?? '',
    senderName: d.senderName ?? '',
    senderPhotoUrl: d.senderPhotoUrl ?? '',
    type: d.type ?? 'like',
    referenceId: d.referenceId ?? '',
    content: d.content ?? '',
    isRead: d.isRead ?? false,
    createdAt: toDate(d.createdAt),
  };
}
