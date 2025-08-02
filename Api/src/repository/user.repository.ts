import { IUserRepository } from "../interfaces/repository-interface/user-repository.interface";
import { UserModel } from "../models/user.model";
import { UserDocument } from "../types/user";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<UserDocument | null> {
    return await UserModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async create(userData: Partial<UserDocument>): Promise<UserDocument> {
    return await UserModel.create(userData);
  }

  async update(
    id: string,
    userData: Partial<UserDocument>
  ): Promise<UserDocument | null> {
    return await UserModel.findByIdAndUpdate(id, userData, {
      new: true,
    }).exec();
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id).exec();
  }
}
