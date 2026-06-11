import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNotificationsList, useMarkRead, useMarkAllRead } from '@/hooks/useNotifications';
import { Avatar } from '@/components/ui/Avatar';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { COLORS, SPACING, FONT_SIZE } from '@/constants';
import { formatTimeAgo } from '@/utils/format';
import type { AppNotification } from '@/types';

export default function NotificationsScreen() {
  const router = useRouter();
  const { data: notifications, isLoading } = useNotificationsList();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const handlePress = useCallback(
    (notification: AppNotification) => {
      if (!notification.isRead) {
        markRead.mutate(notification.id);
      }

      if (notification.type === 'message') {
        router.push(`/chat/${notification.referenceId}`);
      } else if (notification.type === 'follow') {
        router.push(`/user/${notification.senderId}`);
      } else {
        router.push(`/post/${notification.referenceId}`);
      }
    },
    [router, markRead],
  );

  const renderItem = ({ item }: { item: AppNotification }) => {
    const typeIcons: Record<string, string> = {
      like: '♥',
      comment: '💬',
      follow: '👤',
      message: '✉',
    };

    return (
      <TouchableOpacity
        style={[styles.item, !item.isRead && styles.unread]}
        onPress={() => handlePress(item)}
      >
        <Avatar
          uri={item.senderPhotoUrl}
          name={item.senderName}
          size={44}
        />
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>
            <Text style={styles.bold}>{item.senderName}</Text> {item.content}
          </Text>
          <Text style={styles.itemTime}>{formatTimeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.typeIcon}>{typeIcons[item.type]}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={() => markAllRead.mutate()}>
          <Text style={styles.markAll}>Mark all read</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            title="No notifications"
            message="You're all caught up!"
            icon="🔔"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  markAll: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  unread: {
    backgroundColor: '#E8F5FE',
  },
  itemContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
  },
  itemTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  typeIcon: {
    fontSize: 18,
    marginLeft: SPACING.sm,
  },
});
