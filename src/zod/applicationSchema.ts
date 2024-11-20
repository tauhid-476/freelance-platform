import { z } from 'zod';

export const applicationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  email: z.string().email("Invalid email address"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  socialLinks: z.string().optional(), // Default is "PENDING"
});