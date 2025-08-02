import bcrypt from "bcrypt";
import { UserDocument } from "../types/user";
import { CustomJwtPayload } from "../types/auth";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./jwt.service";
import { OtpService } from "./otp.generate.service";
import { setCookies } from "../utils/helpers/setCookies.helper";
import { Response } from "express";
import cloudinary from "./cloudinary.service";
import { IUserRepository } from "../interfaces/repository-interface/user-repository.interface";
import { IOtpRepository } from "../interfaces/repository-interface/otp-repository.interface";
import { IAuthService } from "../interfaces/services-interface/auth-service.interface";

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository,
    private otpService: OtpService
  ) {}

  async register(
    data: {
      name: string;
      email: string;
      phoneNumber: string;
      password: string;
      photoBase64?: string;
    },
    res: Response
  ): Promise<UserDocument> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, StatusCode.CONFLICT);
    }

    let photoUrl: string | undefined = undefined;
    let photoPublicId: string | undefined = undefined;
    if (data.photoBase64) {
      const uploadResponse = await cloudinary.uploader.upload(
        data.photoBase64,
        {
          folder: "url-shortener/profiles",
        }
      );
      photoUrl = uploadResponse.secure_url;
      photoPublicId = uploadResponse.public_id;
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      photoUrl,
      photoPublicId,
      isVerified: false,
    });

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.SERVER_ERROR,
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }

    await this.otpService.generateAndSendOtp(user._id.toString(), user.email);
    return user;
  }

  async verifyOtp(
    userId: string,
    otp: string,
    res: Response
  ): Promise<UserDocument> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }
    if (user.isVerified) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
        StatusCode.BAD_REQUEST
      );
    }

    await this.otpService.verifyOtp(userId, otp);
    const updatedUser = await this.userRepository.update(userId, {
      isVerified: true,
    });
    if (!updatedUser) {
      throw new AppError(
        ERROR_MESSAGES.SERVER_ERROR,
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const payload: CustomJwtPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);
    await this.userRepository.update(userId, { refreshToken });
    setCookies(res, accessToken, refreshToken);

    return updatedUser;
  }

  async resendOtp(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return;
    }
    if (user.isVerified) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
        StatusCode.BAD_REQUEST
      );
    }
    await this.otpService.resendOtp(user._id.toString(), user.email);
  }

  async login(
    email: string,
    password: string,
    res: Response
  ): Promise<UserDocument> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        StatusCode.BAD_REQUEST
      );
    }
    if (!user.isVerified) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_NOT_VERIFIED,
        StatusCode.BAD_REQUEST
      );
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        StatusCode.BAD_REQUEST
      );
    }

    const payload: CustomJwtPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const accessToken = createAccessToken(payload);
    console.log(
      `Access Token generated for user: ${user.email} - ${accessToken}`
    );
    const refreshToken = createRefreshToken(payload);
    await this.userRepository.update(user._id.toString(), { refreshToken });
    setCookies(res, accessToken, refreshToken);

    return user;
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string,
    res: Response
  ): Promise<void> {
    if (!refreshToken) {
      throw new AppError(ERROR_MESSAGES.TOKEN_MISSING, StatusCode.UNAUTHORIZED);
    }

    let shouldRefresh = false;
    try {
      verifyAccessToken(accessToken);
      return;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        shouldRefresh = true;
      } else {
        throw new AppError(
          ERROR_MESSAGES.TOKEN_INVALID,
          StatusCode.UNAUTHORIZED
        );
      }
    }

    if (shouldRefresh) {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError(
          ERROR_MESSAGES.TOKEN_INVALID_REUSED,
          StatusCode.UNAUTHORIZED
        );
      }

      const payload: CustomJwtPayload = {
        id: user._id.toString(),
        email: user.email,
      };
      const newAccessToken = createAccessToken(payload);
      const newRefreshToken = createRefreshToken(payload);
      await this.userRepository.update(user._id.toString(), {
        refreshToken: newRefreshToken,
      });
      setCookies(res, newAccessToken, newRefreshToken);
    }
  }

  async logout(userId: string, res: Response): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      await this.userRepository.update(userId, { refreshToken: undefined });
    }
    res.clearCookie("x-access-token");
    res.clearCookie("x-refresh-token");
  }

  async getMe(userId: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }
    return user;
  }
}
