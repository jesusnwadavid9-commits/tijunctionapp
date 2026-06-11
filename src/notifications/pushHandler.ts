import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { messaging } from '@/firebase/config';
import { userDoc } from '@/firebase/collections';
import { firestore } from '@/firebase/config';
import { useAuthStore } from '@/store/authStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const token = await messaging().getToken();
  return token;
}

export async function saveFcmToken(userId: string, token: string): Promise<void> {
  await userDoc(userId).update({
    fcmTokens: firestore.FieldValue.arrayUnion(token),
  });
}

export function usePushNotifications() {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    let unsubscribeTokenRefresh: (() => void) | undefined;

    const setup = async () => {
      const token = await registerForPushNotifications();
      if (token) {
        await saveFcmToken(user.id, token);
      }

      unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
        await saveFcmToken(user.id, newToken);
      });
    };

    setup();

    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification.title ?? 'TI Junction',
            body: remoteMessage.notification.body ?? '',
          },
          trigger: null,
        });
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeTokenRefresh?.();
    };
  }, [user]);
}
