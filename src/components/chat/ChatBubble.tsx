import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants';
import { formatTimeAgo } from '@/utils/format';
import type { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
}

function ChatBubbleInner({ message, isOwn }: ChatBubbleProps) {
  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        {message.type === 'image' && message.mediaUrl && (
          <Image
            source={{ uri: message.mediaUrl }}
            style={styles.mediaImage}
            contentFit="cover"
            transition={200}
          />
        )}
        {message.content.length > 0 && (
          <Text style={[styles.text, isOwn ? styles.ownText : styles.otherText]}>
            {message.content}
          </Text>
        )}
        <Text style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}>
          {formatTimeAgo(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

export const ChatBubble = memo(ChatBubbleInner);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: BORDER_RADIUS.sm,
  },
  otherBubble: {
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomLeftRadius: BORDER_RADIUS.sm,
  },
  text: {
    fontSize: FONT_SIZE.md,
    lineHeight: 20,
  },
  ownText: {
    color: COLORS.white,
  },
  otherText: {
    color: COLORS.text,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  ownTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherTime: {
    color: COLORS.textLight,
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
});
