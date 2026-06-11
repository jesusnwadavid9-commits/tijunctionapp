import { firestore, storage } from '@/firebase/config';
import {
  userDoc,
  usersRef,
  userFollowersRef,
  userFollowingRef,
  userSavedPostsRef,
} from '@/firebase/collections';
import { userFromDoc } from '@/firebase/converters';
import type { User } from '@/types';

export async function getUserById(userId: string): Promise<User | null> {
  const snap = await userDoc(userId).get();
  if (!snap.exists()) return null;
  return userFromDoc(snap);
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<User, 'displayName' | 'bio'>>,
): Promise<void> {
  await userDoc(userId).update({
    ...updates,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
}

export async function uploadProfilePhoto(
  userId: string,
  uri: string,
): Promise<string> {
  const ref = storage().ref(`users/${userId}/profile.jpg`);
  await ref.putFile(uri);
  const url = await ref.getDownloadURL();
  await userDoc(userId).update({ profilePhotoUrl: url });
  return url;
}

export async function uploadCoverPhoto(
  userId: string,
  uri: string,
): Promise<string> {
  const ref = storage().ref(`users/${userId}/cover.jpg`);
  await ref.putFile(uri);
  const url = await ref.getDownloadURL();
  await userDoc(userId).update({ coverPhotoUrl: url });
  return url;
}

// ─── Follow / Unfollow ───

export async function toggleFollow(
  currentUserId: string,
  targetUserId: string,
): Promise<boolean> {
  const followingRef = userFollowingRef(currentUserId).doc(targetUserId);
  const followerRef = userFollowersRef(targetUserId).doc(currentUserId);
  const snap = await followingRef.get();

  const batch = firestore().batch();

  if (snap.exists()) {
    batch.delete(followingRef);
    batch.delete(followerRef);
    batch.update(userDoc(currentUserId), {
      followingCount: firestore.FieldValue.increment(-1),
    });
    batch.update(userDoc(targetUserId), {
      followersCount: firestore.FieldValue.increment(-1),
    });
    await batch.commit();
    return false;
  } else {
    const now = firestore.FieldValue.serverTimestamp();
    batch.set(followingRef, { userId: targetUserId, createdAt: now });
    batch.set(followerRef, { userId: currentUserId, createdAt: now });
    batch.update(userDoc(currentUserId), {
      followingCount: firestore.FieldValue.increment(1),
    });
    batch.update(userDoc(targetUserId), {
      followersCount: firestore.FieldValue.increment(1),
    });
    await batch.commit();
    return true;
  }
}

export async function isFollowing(
  currentUserId: string,
  targetUserId: string,
): Promise<boolean> {
  const snap = await userFollowingRef(currentUserId).doc(targetUserId).get();
  return snap.exists();
}

export async function getFollowers(userId: string): Promise<string[]> {
  const snapshot = await userFollowersRef(userId).get();
  return snapshot.docs.map((doc) => doc.id);
}

export async function getFollowing(userId: string): Promise<string[]> {
  const snapshot = await userFollowingRef(userId).get();
  return snapshot.docs.map((doc) => doc.id);
}

// ─── Saved Posts ───

export async function toggleSavePost(
  userId: string,
  postId: string,
): Promise<boolean> {
  const ref = userSavedPostsRef(userId).doc(postId);
  const snap = await ref.get();

  if (snap.exists()) {
    await ref.delete();
    const { postDoc: getPostDoc } = await import('@/firebase/collections');
    await getPostDoc(postId).update({
      savesCount: firestore.FieldValue.increment(-1),
    });
    return false;
  } else {
    await ref.set({
      postId,
      savedAt: firestore.FieldValue.serverTimestamp(),
    });
    const { postDoc: getPostDoc } = await import('@/firebase/collections');
    await getPostDoc(postId).update({
      savesCount: firestore.FieldValue.increment(1),
    });
    return true;
  }
}

// ─── Search ───

export async function searchUsers(query: string): Promise<User[]> {
  if (!query.trim()) return [];
  const snapshot = await usersRef()
    .where('displayName', '>=', query)
    .where('displayName', '<=', query + '\uf8ff')
    .limit(20)
    .get();
  return snapshot.docs.map(userFromDoc);
}
