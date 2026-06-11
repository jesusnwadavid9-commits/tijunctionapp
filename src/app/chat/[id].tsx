import React, { useCallback } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import {
  useRealtimeMessages,
  useRealtimeConversation,
  useSendMessage,
  useTypingIndicator,
  useMarkRead,
} from '@/hooks/useMessages';
import { useAuthStore } from '@/store/authStore';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { Loading } from '@/components/common/Loading';
import { COLORS, SPACING, FONT_SIZE } from '@/constants';
import type { Message } from '@/types';

export default function ChatScreen() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { messages, loading } = useRealtimeMessages(conversationId);
  const conversation = useRealtimeConversation(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const { setTyping } = useTypingIndicator(conversationId);
  const markRead = useMarkRead(conversationId);

  const otherUserId =
    conversation?.participants.find((p) => p !== user?.id) ?? '';

  const isOtherTyping = conversation?.typing?.[otherUserId] ?? false;

  const handleSend = useCallback(
    (content: string) => {
      sendMessage.mutate({ content });
    },
    [sendMessage],
  );

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      // Mark as read when rendered
      if (user && !item.readBy[user.id]) {
        markRead(item.id);
      }
      return <ChatBubble message={item} isOwn={item.senderId === user?.id} />;
    },
    [user, markRead],
  );

  if (loading) return <Loading />;

  return (
    <>
      <Stack.Screen options={{ title: otherUserId || 'Chat' }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          inverted
          keyExtractor={(item) => item.id}
        />

        {isOtherTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>typing...</Text>
          </View>
        )}

        <ChatInput
          onSend={handleSend}
          onTyping={setTyping}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  typingIndicator: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  typingText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});
