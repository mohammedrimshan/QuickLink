import { Schema, model } from "mongoose";
import { UserDocument } from "../types/user";

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    photoUrl: String,
    photoPublicId: String,
    isVerified: { type: Boolean, default: false },
    googleId: String,
    password: String,
    refreshToken: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);
