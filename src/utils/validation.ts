import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const editProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long'),
  bio: z.string().max(160, 'Bio must be 160 characters or less'),
});

export const createPostSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(5000),
  tags: z.string().optional(),
});

export const reportSchema = z.object({
  reason: z.string().min(10, 'Please provide more detail').max(500),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type EditProfileInput = z.infer<typeof editProfileSchema>;
export type CreatePostFormInput = z.infer<typeof createPostSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
