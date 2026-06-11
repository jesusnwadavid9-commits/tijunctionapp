import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeedPosts } from '@/services/postService';
import type { Post } from '@/types';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type DocumentSnapshot = FirebaseFirestoreTypes.DocumentSnapshot;

interface FeedPage {
  posts: Post[];
  lastDocument: DocumentSnapshot | null;
}

export function useFeed() {
  return useInfiniteQuery<FeedPage, Error>({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) => {
      return getFeedPosts(pageParam as DocumentSnapshot | null | undefined);
    },
    getNextPageParam: (lastPage) => lastPage.lastDocument ?? undefined,
    initialPageParam: null,
  });
}
