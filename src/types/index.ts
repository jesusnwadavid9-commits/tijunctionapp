// ─── User ───
export interface User {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  profilePhotoUrl: string;
  coverPhotoUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen: Date;
  fcmTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserPreview = Pick<
  User,
  'id' | 'displayName' | 'profilePhotoUrl' | 'isVerified'
>;

// ─── Post ───
export type PostType = 'text' | 'image' | 'video' | 'multi-image';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string;
  type: PostType;
  content: string;
  imageUrls: string[];
  videoUrl: string;
  thumbnailUrl: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  tags: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostInput {
  type: PostType;
  content: string;
  imageUrls?: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
}

// ─── Comment ───
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string;
  content: string;
  parentId: string | null;
  likesCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Conversation / Message ───
export type MessageType = 'text' | 'image' | 'video';

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  lastMessageSenderId: string;
  typing: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  mediaUrl: string | null;
  readBy: Record<string, Date>;
  isDeleted: boolean;
  createdAt: Date;
}

// ─── Notification ───
export type NotificationType = 'like' | 'comment' | 'follow' | 'message';

export interface AppNotification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderPhotoUrl: string;
  type: NotificationType;
  referenceId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

// ─── Report ───
export type ReportTargetType = 'post' | 'comment' | 'user';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
}

// ─── Feed ───
export type FeedItem =
  | { type: 'post'; data: Post }
  | { type: 'ad'; data: { id: string } };
