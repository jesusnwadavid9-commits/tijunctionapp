import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useUserProfile, useIsFollowing, useToggleFollow, useUserPosts } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/authStore';
import { getOrCreateConversation } from '@/services/messageService';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PostCard } from '@/components/post/PostCard';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { COLORS, SPACING, FONT_SIZE } from '@/constants';
import type { Post } from '@/types';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { data: profileUser, isLoading } = useUserProfile(id);
  const { data: isFollowing } = useIsFollowing(id);
  const toggleFollow = useToggleFollow(id);
  const { data: postsData } = useUserPosts(id);
  const isOwnProfile = currentUser?.id === id;

  const handleMessage = useCallback(async () => {
    if (!currentUser) return;
    const conversation = await getOrCreateConversation(currentUser.id, id);
    router.push(`/chat/${conversation.id}`);
  }, [currentUser, id, router]);

  if (isLoading || !profileUser) return <Loading />;

  return (
    <>
      <Stack.Screen options={{ title: profileUser.displayName }} />
      <ScrollView style={styles.container}>
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={() => toggleFollow.mutate()}
          onEditProfile={() => {}}
        />

        {!isOwnProfile && (
          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        )}

        <View style={styles.postsSection}>
          {postsData && postsData.posts.length > 0 ? (
            postsData.posts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <EmptyState title="No posts yet" icon="📝" />
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messageButton: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageButtonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: FONT_SIZE.md,
  },
  postsSection: {
    minHeight: 200,
  },
});
