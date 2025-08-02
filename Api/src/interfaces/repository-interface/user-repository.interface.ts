import { IUser, UserDocument } from "../../types/user";

export interface IUserRepository {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(userData: Partial<IUser>): Promise<UserDocument>;
  update(id: string, userData: Partial<IUser>): Promise<UserDocument | null>;
  delete(id: string): Promise<void>;
}