import { firestore } from '@/firebase/config';
import { notificationsRef } from '@/firebase/collections';
import { notificationFromDoc } from '@/firebase/converters';
import type { AppNotification, NotificationType, User } from '@/types';

export async function getNotifications(
  userId: string,
): Promise<AppNotification[]> {
  const snapshot = await notificationsRef()
    .where('recipientId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  return snapshot.docs.map(notificationFromDoc);
}

export async function markNotificationRead(
  notificationId: string,
): Promise<void> {
  await notificationsRef().doc(notificationId).update({ isRead: true });
}

export async function markAllNotificationsRead(
  userId: string,
): Promise<void> {
  const snapshot = await notificationsRef()
    .where('recipientId', '==', userId)
    .where('isRead', '==', false)
    .get();

  const batch = firestore().batch();
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { isRead: true });
  });
  await batch.commit();
}

export async function createNotification(
  recipientId: string,
  sender: User,
  type: NotificationType,
  referenceId: string,
  content: string,
): Promise<void> {
  if (recipientId === sender.id) return;

  await notificationsRef().add({
    recipientId,
    senderId: sender.id,
    senderName: sender.displayName,
    senderPhotoUrl: sender.profilePhotoUrl,
    type,
    referenceId,
    content,
    isRead: false,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  const snapshot = await notificationsRef()
    .where('recipientId', '==', userId)
    .where('isRead', '==', false)
    .get();
  return snapshot.size;
}
