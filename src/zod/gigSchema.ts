import { z } from "zod"

export const gigSchema = z.object({
  title: z.string().min(3,"Title is req"),
  description: z.string(),
  maxApplications: z.number().min(10),
  daysLeft: z.number().min(3),
  image: z.string().optional(),
  reward: z.number(),
  isActive: z.boolean(),
  postedById: z.string(),
})