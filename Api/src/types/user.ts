import { Document, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  photoUrl?: string;
  photoPublicId?: string;
  googleId?: string;
  isVerified?: boolean;
  password?: string;
  createdAt?: Date;
  refreshToken?: string;
}

export interface UserDocument extends Document<Types.ObjectId>, IUser {}
