import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPostById,
  toggleLike,
  isPostLiked,
  addComment,
  getComments,
  incrementShareCount,
} from '@/services/postService';
import { toggleSavePost } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types';

export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
}

export function useIsPostLiked(postId: string) {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['postLiked', postId, user?.id],
    queryFn: () => isPostLiked(postId, user!.id),
    enabled: !!user && !!postId,
  });
}

export function useToggleLike(postId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: () => toggleLike(postId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['postLiked', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useComments(postId: string, parentId: string | null = null) {
  return useQuery({
    queryKey: ['comments', postId, parentId],
    queryFn: () => getComments(postId, parentId),
    enabled: !!postId,
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({
      content,
      parentId,
    }: {
      content: string;
      parentId?: string | null;
    }) => addComment(postId, user as User, content, parentId ?? null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

export function useToggleSave(postId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: () => toggleSavePost(user!.id, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useSharePost(postId: string) {
  return useMutation({
    mutationFn: () => incrementShareCount(postId),
  });
}
