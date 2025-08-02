import { IOtp, OtpDocument } from "../../types/otp";
import { Types } from "mongoose";

export interface IOtpRepository {
  findByUserIdAndOtp(userId: Types.ObjectId, otp: string): Promise<OtpDocument | null>;
  create(otpData: Partial<IOtp>): Promise<OtpDocument>;
  deleteManyByUserId(userId: Types.ObjectId): Promise<void>;
}
