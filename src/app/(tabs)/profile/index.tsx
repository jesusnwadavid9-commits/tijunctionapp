import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserPosts } from '@/hooks/useProfile';
import { signOut } from '@/services/authService';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { COLORS, SPACING } from '@/constants';
import type { Post } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, reset } = useAuthStore();
  const { data: postsData, isLoading } = useUserPosts(user?.id ?? '');
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await signOut();
      reset();
      router.replace('/(auth)/login');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setSigningOut(false);
    }
  }, [router, reset]);

  if (!user) return <Loading />;

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileHeader
          user={user}
          isOwnProfile
          onEditProfile={() => {
            // TODO: Navigate to edit profile
          }}
        />
        <View style={styles.postsSection}>
          {isLoading ? (
            <Loading />
          ) : postsData && postsData.posts.length > 0 ? (
            postsData.posts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <EmptyState title="No posts yet" icon="📝" />
          )}
        </View>
        <View style={styles.signOutSection}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            loading={signingOut}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  postsSection: {
    minHeight: 200,
  },
  signOutSection: {
    padding: SPACING.xxl,
  },
});
