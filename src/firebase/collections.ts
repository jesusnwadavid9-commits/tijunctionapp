import { firestore } from './config';

const db = firestore();

export const usersRef = () => db.collection('users');
export const userDoc = (userId: string) => db.collection('users').doc(userId);

export const userFollowersRef = (userId: string) =>
  db.collection('users').doc(userId).collection('followers');

export const userFollowingRef = (userId: string) =>
  db.collection('users').doc(userId).collection('following');

export const userSavedPostsRef = (userId: string) =>
  db.collection('users').doc(userId).collection('savedPosts');

export const postsRef = () => db.collection('posts');
export const postDoc = (postId: string) => db.collection('posts').doc(postId);

export const postLikesRef = (postId: string) =>
  db.collection('posts').doc(postId).collection('likes');

export const postCommentsRef = (postId: string) =>
  db.collection('posts').doc(postId).collection('comments');

export const conversationsRef = () => db.collection('conversations');
export const conversationDoc = (id: string) =>
  db.collection('conversations').doc(id);

export const messagesRef = (conversationId: string) =>
  db.collection('conversations').doc(conversationId).collection('messages');

export const notificationsRef = () => db.collection('notifications');

export const reportsRef = () => db.collection('reports');
