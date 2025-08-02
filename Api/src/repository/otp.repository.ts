import { IOtpRepository } from "../interfaces/repository-interface/otp-repository.interface";
import { OTPModel } from "../models/otp.model";
import { OtpDocument } from "../types/otp";
import { Types } from "mongoose";

export class OtpRepository implements IOtpRepository {
  async findByUserIdAndOtp(
    userId: Types.ObjectId, 
    otp: string
  ): Promise<OtpDocument | null> {
    return await OTPModel.findOne({ userId, otp }).exec();
  }

  async create(otpData: Partial<OtpDocument>): Promise<OtpDocument> {
    return await OTPModel.create(otpData);
  }

  async deleteManyByUserId(userId: Types.ObjectId): Promise<void> { 
    await OTPModel.deleteMany({ userId }).exec();
  }
}
