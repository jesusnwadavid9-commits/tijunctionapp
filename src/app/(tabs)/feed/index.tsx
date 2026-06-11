import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useFeed } from '@/hooks/useFeed';
import { PostCard } from '@/components/post/PostCard';
import { CreatePostForm } from '@/components/post/CreatePostForm';
import { NativeFeedAd } from '@/ads/NativeFeedAd';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { COLORS, AD_INTERVAL } from '@/constants';
import type { FeedItem, Post } from '@/types';

export default function FeedScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useFeed();

  const feedItems: FeedItem[] = useMemo(() => {
    if (!data?.pages) return [];
    const allPosts = data.pages.flatMap((page) => page.posts);
    const items: FeedItem[] = [];

    allPosts.forEach((post, index) => {
      items.push({ type: 'post', data: post });
      if ((index + 1) % AD_INTERVAL === 0) {
        items.push({ type: 'ad', data: { id: `ad-${index}` } });
      }
    });

    return items;
  }, [data]);

  const renderItem = useCallback(({ item }: { item: FeedItem }) => {
    if (item.type === 'ad') {
      return <NativeFeedAd />;
    }
    return <PostCard post={item.data as Post} />;
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <FlashList
        data={feedItems}
        renderItem={renderItem}
        ListHeaderComponent={<CreatePostForm />}
        ListEmptyComponent={
          <EmptyState
            title="No posts yet"
            message="Be the first to post something!"
            icon="📝"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <Loading size="small" /> : null}
        keyExtractor={(item) =>
          item.type === 'ad' ? item.data.id : (item.data as Post).id
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
