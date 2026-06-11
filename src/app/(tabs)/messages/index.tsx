import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useConversations } from '@/hooks/useMessages';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { COLORS, SPACING, FONT_SIZE } from '@/constants';
import { formatTimeAgo, truncate } from '@/utils/format';
import type { Conversation } from '@/types';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: conversations, isLoading } = useConversations();

  const renderItem = useCallback(
    ({ item }: { item: Conversation }) => {
      const otherUserId = item.participants.find((id) => id !== user?.id) ?? '';

      return (
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push(`/chat/${item.id}`)}
        >
          <Avatar name={otherUserId} size={50} showOnline />
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName} numberOfLines={1}>
                {otherUserId}
              </Text>
              <Text style={styles.itemTime}>
                {formatTimeAgo(item.lastMessageAt)}
              </Text>
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {truncate(item.lastMessage, 50)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [user, router],
  );

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            title="No messages yet"
            message="Start a conversation from someone's profile"
            icon="💬"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  itemTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
  lastMessage: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
