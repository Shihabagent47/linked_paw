import { z } from 'zod'

const uuid = z.string().uuid('Invalid ID format')

export const PostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Max 5000 characters'),
})

export const CommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Max 2000 characters'),
})

export const ReactionSchema = z.object({
  type: z.enum(['like', 'celebrate', 'paw', 'roar', 'curious', 'support']),
})

export const ConnectionSchema = z.object({
  receiver_id: uuid,
})

export const ConnectionActionSchema = z.object({
  action: z.enum(['accept', 'decline']),
})

export const JobSchema = z.object({
  title: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  requirements: z.array(z.string().max(500)).max(20).default([]),
  salary: z.string().max(200).optional(),
  species_tag: z.string().max(100).optional(),
})

export const CheckoutSchema = z.object({
  plan: z.enum(['monthly', 'yearly']),
})

export const NotifIdSchema = uuid

export const IMAGE_MAX_BYTES = 2 * 1024 * 1024 // 2 MB
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
