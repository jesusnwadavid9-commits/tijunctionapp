import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants';
import { formatTimeAgo, formatCount } from '@/utils/format';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  isLiked?: boolean;
}

function PostCardInner({ post, onLike, onComment, isLiked }: PostCardProps) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push(`/post/${post.id}`);
  }, [router, post.id]);

  const handleAuthorPress = useCallback(() => {
    router.push(`/user/${post.authorId}`);
  }, [router, post.authorId]);

  const handleShare = useCallback(async () => {
    await Share.share({
      message: `Check out this post on TI Junction: ${post.content.slice(0, 100)}`,
    });
  }, [post.content]);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAuthorPress} style={styles.authorRow}>
          <Avatar uri={post.authorPhotoUrl} name={post.authorName} size={40} />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.authorName}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(post.createdAt)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {post.content.length > 0 && (
        <Text style={styles.content}>{post.content}</Text>
      )}

      {/* Media */}
      {post.type === 'image' && post.imageUrls.length > 0 && (
        <Image
          source={{ uri: post.imageUrls[0] }}
          style={styles.singleImage}
          contentFit="cover"
          transition={200}
        />
      )}

      {post.type === 'multi-image' && post.imageUrls.length > 0 && (
        <View style={styles.imageGrid}>
          {post.imageUrls.slice(0, 4).map((url, index) => (
            <Image
              key={url}
              source={{ uri: url }}
              style={[
                styles.gridImage,
                post.imageUrls.length === 1 && styles.singleImage,
              ]}
              contentFit="cover"
              transition={200}
            />
          ))}
          {post.imageUrls.length > 4 && (
            <View style={styles.moreOverlay}>
              <Text style={styles.moreText}>+{post.imageUrls.length - 4}</Text>
            </View>
          )}
        </View>
      )}

      {post.type === 'video' && post.thumbnailUrl && (
        <View style={styles.videoContainer}>
          <Image
            source={{ uri: post.thumbnailUrl }}
            style={styles.singleImage}
            contentFit="cover"
          />
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.actionButton}>
          <Text style={[styles.actionIcon, isLiked && styles.liked]}>
            {isLiked ? '♥' : '♡'}
          </Text>
          <Text style={[styles.actionText, isLiked && styles.liked]}>
            {formatCount(post.likesCount)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onComment} style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{formatCount(post.commentsCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
          <Text style={styles.actionIcon}>↗</Text>
          <Text style={styles.actionText}>{formatCount(post.sharesCount)}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export const PostCard = memo(PostCardInner);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorInfo: {
    marginLeft: SPACING.sm,
  },
  authorName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  timestamp: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  content: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 20,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  singleImage: {
    width: '100%',
    height: 300,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridImage: {
    width: '50%',
    height: 150,
  },
  moreOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '50%',
    height: 150,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
  },
  videoContainer: {
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: COLORS.white,
    fontSize: 20,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.xl,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: SPACING.xs,
    color: COLORS.textSecondary,
  },
  actionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  liked: {
    color: COLORS.error,
  },
});
