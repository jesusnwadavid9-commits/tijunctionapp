import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserById,
  toggleFollow,
  isFollowing,
  getFollowers,
  getFollowing,
} from '@/services/userService';
import { getUserPosts } from '@/services/postService';
import { useAuthStore } from '@/store/authStore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type { Post } from '@/types';

type DocumentSnapshot = FirebaseFirestoreTypes.DocumentSnapshot;

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
}

export function useIsFollowing(targetUserId: string) {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['isFollowing', user?.id, targetUserId],
    queryFn: () => isFollowing(user!.id, targetUserId),
    enabled: !!user && !!targetUserId && user.id !== targetUserId,
  });
}

export function useToggleFollow(targetUserId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: () => toggleFollow(user!.id, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', targetUserId] });
      queryClient.invalidateQueries({
        queryKey: ['isFollowing', user?.id, targetUserId],
      });
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
    },
  });
}

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
}

export function useFollowingList(userId: string) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  });
}

interface UserPostsPage {
  posts: Post[];
  lastDocument: DocumentSnapshot | null;
}

export function useUserPosts(userId: string) {
  return useQuery<UserPostsPage>({
    queryKey: ['userPosts', userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
}
