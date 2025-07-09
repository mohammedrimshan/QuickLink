import z from "zod";
import { userSchema } from "./user.zod";

export const registerUserSchema = userSchema.extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must not exceed 32 characters"),
});
