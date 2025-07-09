import { z } from "zod";

export const createUrlSchema = z.object({
  longUrl: z
    .string()
    .url("Invalid URL format")
    .min(10, "URL is too short"),

  customUrl: z
    .string()
    .min(3, "Custom URL must be at least 3 characters")
    .max(30, "Custom URL too long")
    .regex(/^[a-zA-Z0-9_-]*$/, "Custom URL can only contain letters, numbers, hyphens, or underscores")
    .optional(),

  userId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid user ID format") // MongoDB ObjectId
    .optional(),
});
