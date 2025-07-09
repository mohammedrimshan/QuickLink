import { Request, Response } from "express";
import bcrypt from "bcrypt";
import cloudinary from "../services/cloudinary.service";
import { UserModel } from "../models/user.model";
import { OTPModel } from "../models/otp.model";
import { AppError } from "../utils/appError";
import { CustomJwtPayload } from "../types/auth";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../services/jwt.service";
import { setCookies } from "../utils/helpers/setCookies.helper";
import { StatusCode } from "../constants/statusCode";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { generateOTP } from "../services/otp.generate.service";
import { sendOTPEmail } from "../services/email.service";

// Register controller
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, password, photoBase64 } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, StatusCode.CONFLICT);
    }

    let photoUrl: string | null = null;
    let photoPublicId: string | null = null;

    if (photoBase64) {
      const uploadResponse = await cloudinary.uploader.upload(photoBase64, {
        folder: "url-shortener/profiles",
      });
      photoUrl = uploadResponse.secure_url;
      photoPublicId = uploadResponse.public_id;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      photoUrl,
      photoPublicId,
      isVerified: false,
    });

    // Generate OTP and save
    const otp = generateOTP();
    console.log(`OTP generated for user: ${email} - ${otp}`);
    const otpDoc = await OTPModel.create({
      userId: user._id,
      email: user.email,
      otp,
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(StatusCode.CREATED).json({
      success: true,
      message:
        "Registration successful. Please verify your email with the OTP sent.",
      userId: user._id,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};

// Verify OTP controller
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED, StatusCode.BAD_REQUEST);
    }

    const otpDoc = await OTPModel.findOne({ userId, otp });
    if (!otpDoc) {
      throw new AppError(ERROR_MESSAGES.INVALID_OTP, StatusCode.BAD_REQUEST);
    }

    user.isVerified = true;
    await user.save();
    await OTPModel.deleteOne({ _id: otpDoc._id });

    // Create tokens
    const payload: CustomJwtPayload = {
      id: user.id.toString(),
      email: user.email,
    };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    setCookies(res, accessToken, refreshToken);

    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};

// Resend OTP controller
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.OTP_RESENT,
      });
      return;  
    }

    if (user.isVerified) {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED, StatusCode.BAD_REQUEST);
    }

    await OTPModel.deleteMany({ userId: user._id });

    const otp = generateOTP();
    console.log(otp, "OTP generated for user:", user.email);
    await OTPModel.create({
      userId: user._id,
      email: user.email,
      otp,
    });

    await sendOTPEmail(user.email, otp);

    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.OTP_RESENT,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};



// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, StatusCode.BAD_REQUEST);
    }

    if (!user.isVerified) {
      throw new AppError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED, StatusCode.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, StatusCode.BAD_REQUEST);
    }

    // Create tokens
    const payload: CustomJwtPayload = {
      id: user.id.toString(),
      email: user.email,
    };

    const accessToken = createAccessToken(payload);
    console.log(accessToken, "Access Token generated for user:", user.email);
    const refreshToken = createRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    setCookies(res, accessToken, refreshToken);

    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const accessToken = req.cookies["x-access-token"];
  const refreshToken = req.cookies["x-refresh-token"];

  if (!refreshToken) {
    throw new AppError(ERROR_MESSAGES.TOKEN_MISSING, StatusCode.UNAUTHORIZED);
  }

  let shouldRefresh = false;

  try {
    verifyAccessToken(accessToken);
    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.TOKEN_VALID,
    });
    return;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      shouldRefresh = true;
    } else {
      throw new AppError(ERROR_MESSAGES.TOKEN_INVALID, StatusCode.UNAUTHORIZED);
    }
  }

  if (shouldRefresh) {
    try {
      const decoded: any = verifyRefreshToken(refreshToken);
      const user = await UserModel.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError(
          ERROR_MESSAGES.TOKEN_INVALID_REUSED,
          StatusCode.UNAUTHORIZED
        );
      }

      const payload: CustomJwtPayload = {
        id: user._id as string,
        email: user.email,
      };

      const newAccessToken = createAccessToken(payload);

      const newRefreshToken = createRefreshToken(payload);

      user.refreshToken = newRefreshToken;

      await user.save();

      setCookies(res, newAccessToken, newRefreshToken);

      res.status(StatusCode.OK).json({
        success: true,
      });
    } catch (err) {
      throw new AppError(
        ERROR_MESSAGES.REFRESH_TOKEN_INVALID,
        StatusCode.UNAUTHORIZED
      );
    }
  }
};



// Logout controller
export const logout = async (req: Request, res: Response) => {
  try {

    const user = await UserModel.findById(req.user?.id);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    res.clearCookie("x-access-token");
    res.clearCookie("x-refresh-token");

    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    });
  } catch (error: any) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
