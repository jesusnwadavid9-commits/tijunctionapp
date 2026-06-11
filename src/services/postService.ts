import { firestore } from '@/firebase/config';
import {
  postsRef,
  postDoc,
  postLikesRef,
  postCommentsRef,
} from '@/firebase/collections';
import { postFromDoc, commentFromDoc } from '@/firebase/converters';
import type { Post, Comment, CreatePostInput, User } from '@/types';
import { POSTS_PER_PAGE } from '@/constants';
import {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

type DocumentSnapshot = FirebaseFirestoreTypes.DocumentSnapshot;

export async function createPost(
  input: CreatePostInput,
  author: User,
): Promise<Post> {
  const now = firestore.FieldValue.serverTimestamp();
  const ref = postsRef().doc();
  const data = {
    authorId: author.id,
    authorName: author.displayName,
    authorPhotoUrl: author.profilePhotoUrl,
    type: input.type,
    content: input.content,
    imageUrls: input.imageUrls ?? [],
    videoUrl: input.videoUrl ?? '',
    thumbnailUrl: input.thumbnailUrl ?? '',
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    savesCount: 0,
    tags: input.tags ?? [],
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(data);

  // Increment user post count
  const { userDoc: getUserDoc } = await import('@/firebase/collections');
  await getUserDoc(author.id).update({
    postsCount: firestore.FieldValue.increment(1),
  });

  const snap = await ref.get();
  return postFromDoc(snap);
}

export async function getFeedPosts(
  lastDoc?: DocumentSnapshot | null,
): Promise<{ posts: Post[]; lastDocument: DocumentSnapshot | null }> {
  let query = postsRef()
    .where('isDeleted', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(POSTS_PER_PAGE);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();
  const posts = snapshot.docs.map(postFromDoc);
  const lastDocument = snapshot.docs[snapshot.docs.length - 1] ?? null;

  return { posts, lastDocument };
}

export async function getUserPosts(
  userId: string,
  lastDoc?: DocumentSnapshot | null,
): Promise<{ posts: Post[]; lastDocument: DocumentSnapshot | null }> {
  let query = postsRef()
    .where('authorId', '==', userId)
    .where('isDeleted', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(POSTS_PER_PAGE);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();
  const posts = snapshot.docs.map(postFromDoc);
  const lastDocument = snapshot.docs[snapshot.docs.length - 1] ?? null;

  return { posts, lastDocument };
}

export async function getPostById(postId: string): Promise<Post | null> {
  const snap = await postDoc(postId).get();
  if (!snap.exists()) return null;
  return postFromDoc(snap);
}

export async function deletePost(postId: string, authorId: string): Promise<void> {
  await postDoc(postId).update({ isDeleted: true });
  const { userDoc: getUserDoc } = await import('@/firebase/collections');
  await getUserDoc(authorId).update({
    postsCount: firestore.FieldValue.increment(-1),
  });
}

// ─── Likes ───

export async function toggleLike(
  postId: string,
  userId: string,
): Promise<boolean> {
  const likeRef = postLikesRef(postId).doc(userId);
  const snap = await likeRef.get();

  if (snap.exists()) {
    await likeRef.delete();
    await postDoc(postId).update({
      likesCount: firestore.FieldValue.increment(-1),
    });
    return false;
  } else {
    await likeRef.set({
      userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    await postDoc(postId).update({
      likesCount: firestore.FieldValue.increment(1),
    });
    return true;
  }
}

export async function isPostLiked(
  postId: string,
  userId: string,
): Promise<boolean> {
  const snap = await postLikesRef(postId).doc(userId).get();
  return snap.exists();
}

// ─── Comments ───

export async function addComment(
  postId: string,
  author: User,
  content: string,
  parentId: string | null = null,
): Promise<Comment> {
  const ref = postCommentsRef(postId).doc();
  const now = firestore.FieldValue.serverTimestamp();
  await ref.set({
    postId,
    authorId: author.id,
    authorName: author.displayName,
    authorPhotoUrl: author.profilePhotoUrl,
    content,
    parentId,
    likesCount: 0,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  });

  await postDoc(postId).update({
    commentsCount: firestore.FieldValue.increment(1),
  });

  const snap = await ref.get();
  return commentFromDoc(snap);
}

export async function getComments(
  postId: string,
  parentId: string | null = null,
): Promise<Comment[]> {
  const snapshot = await postCommentsRef(postId)
    .where('parentId', '==', parentId)
    .where('isDeleted', '==', false)
    .orderBy('createdAt', 'asc')
    .get();

  return snapshot.docs.map(commentFromDoc);
}

// ─── Share ───

export async function incrementShareCount(postId: string): Promise<void> {
  await postDoc(postId).update({
    sharesCount: firestore.FieldValue.increment(1),
  });
}
