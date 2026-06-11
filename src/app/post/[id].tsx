import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { usePostDetail, useComments, useAddComment, useToggleLike, useIsPostLiked } from '@/hooks/usePost';
import { useInterstitialAd } from '@/ads/useInterstitialAd';
import { PostCard } from '@/components/post/PostCard';
import { Avatar } from '@/components/ui/Avatar';
import { Loading } from '@/components/common/Loading';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants';
import { formatTimeAgo } from '@/utils/format';
import type { Comment } from '@/types';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isLoading } = usePostDetail(id);
  const { data: comments } = useComments(id);
  const addComment = useAddComment(id);
  const toggleLike = useToggleLike(id);
  const { data: isLiked } = useIsPostLiked(id);
  const { showIfReady } = useInterstitialAd();
  const [commentText, setCommentText] = useState('');

  // Show interstitial ad when post is viewed
  React.useEffect(() => {
    showIfReady();
  }, [showIfReady]);

  const handleAddComment = useCallback(() => {
    if (!commentText.trim()) return;
    addComment.mutate(
      { content: commentText.trim() },
      {
        onSuccess: () => setCommentText(''),
        onError: (err: Error) => Alert.alert('Error', err.message),
      },
    );
  }, [commentText, addComment]);

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.comment}>
      <Avatar uri={item.authorPhotoUrl} name={item.authorName} size={32} />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{item.authorName}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentTime}>{formatTimeAgo(item.createdAt)}</Text>
      </View>
    </View>
  );

  if (isLoading || !post) return <Loading />;

  return (
    <>
      <Stack.Screen options={{ title: 'Post' }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={comments ?? []}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <PostCard
              post={post}
              onLike={() => toggleLike.mutate()}
              isLiked={isLiked}
            />
          }
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.textLight}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!commentText.trim() || addComment.isPending}
            style={styles.sendButton}
          >
            <Text
              style={[
                styles.sendText,
                !commentText.trim() && styles.sendDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingBottom: SPACING.lg },
  comment: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  commentContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  commentAuthor: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  commentText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 20,
    marginTop: 2,
  },
  commentTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  commentInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 80,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  sendButton: {
    marginLeft: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  sendText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
  sendDisabled: { opacity: 0.4 },
});
