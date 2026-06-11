import { auth, firestore } from '@/firebase/config';
import { userDoc } from '@/firebase/collections';
import { userFromDoc } from '@/firebase/converters';
import type { User } from '@/types';

export async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  const uid = credential.user.uid;

  await credential.user.updateProfile({ displayName });

  const now = firestore.FieldValue.serverTimestamp();
  const userData = {
    email,
    displayName,
    bio: '',
    profilePhotoUrl: '',
    coverPhotoUrl: '',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isVerified: false,
    isOnline: true,
    lastSeen: now,
    fcmTokens: [],
    createdAt: now,
    updatedAt: now,
  };

  await userDoc(uid).set(userData);

  const snap = await userDoc(uid).get();
  return userFromDoc(snap);
}

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await auth().signInWithEmailAndPassword(email, password);
  const uid = credential.user.uid;
  await userDoc(uid).update({
    isOnline: true,
    lastSeen: firestore.FieldValue.serverTimestamp(),
  });
  const snap = await userDoc(uid).get();
  return userFromDoc(snap);
}

export async function signOut(): Promise<void> {
  const uid = auth().currentUser?.uid;
  if (uid) {
    await userDoc(uid).update({
      isOnline: false,
      lastSeen: firestore.FieldValue.serverTimestamp(),
    });
  }
  await auth().signOut();
}

export async function resetPassword(email: string): Promise<void> {
  await auth().sendPasswordResetEmail(email);
}

export async function getCurrentUser(): Promise<User | null> {
  const firebaseUser = auth().currentUser;
  if (!firebaseUser) return null;
  const snap = await userDoc(firebaseUser.uid).get();
  if (!snap.exists()) return null;
  return userFromDoc(snap);
}
