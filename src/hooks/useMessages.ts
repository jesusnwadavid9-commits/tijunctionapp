import { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserConversations,
  sendMessage,
  setTypingIndicator,
  markMessageAsRead,
} from '@/services/messageService';
import { messagesRef, conversationDoc } from '@/firebase/collections';
import { messageFromDoc, conversationFromDoc } from '@/firebase/converters';
import { useAuthStore } from '@/store/authStore';
import type { Message, Conversation, MessageType } from '@/types';

export function useConversations() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: () => getUserConversations(user!.id),
    enabled: !!user,
  });
}

export function useRealtimeMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = messagesRef(conversationId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot(
        (snapshot) => {
          const msgs = snapshot.docs.map(messageFromDoc);
          setMessages(msgs);
          setLoading(false);
        },
        () => setLoading(false),
      );

    return unsubscribe;
  }, [conversationId]);

  return { messages, loading };
}

export function useRealtimeConversation(conversationId: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = conversationDoc(conversationId).onSnapshot(
      (snap) => {
        if (snap.exists()) {
          setConversation(conversationFromDoc(snap));
        }
      },
    );

    return unsubscribe;
  }, [conversationId]);

  return conversation;
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({
      content,
      type,
      mediaUrl,
    }: {
      content: string;
      type?: MessageType;
      mediaUrl?: string | null;
    }) => sendMessage(conversationId, user!.id, content, type, mediaUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useTypingIndicator(conversationId: string) {
  const { user } = useAuthStore();

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (user && conversationId) {
        setTypingIndicator(conversationId, user.id, isTyping);
      }
    },
    [user, conversationId],
  );

  return { setTyping };
}

export function useMarkRead(conversationId: string) {
  const { user } = useAuthStore();

  return useCallback(
    (messageId: string) => {
      if (user) {
        markMessageAsRead(conversationId, messageId, user.id);
      }
    },
    [user, conversationId],
  );
}
