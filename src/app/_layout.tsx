import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAuthListener } from '@/hooks/useAuth';
import { usePushNotifications } from '@/notifications/pushHandler';
import { COLORS } from '@/constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

function AppInner() {
  useAuthListener();
  usePushNotifications();

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="post/[id]"
          options={{ headerShown: true, title: 'Post', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="user/[id]"
          options={{ headerShown: true, title: 'Profile', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="chat/[id]"
          options={{ headerShown: true, title: 'Chat', headerBackTitle: 'Back' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppInner />
        </QueryClientProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
