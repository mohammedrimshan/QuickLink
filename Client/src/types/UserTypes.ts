
export interface IRegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  photoBase64?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IVerifyOtpRequest {
  userId: string;
  otp: string;
}

export interface IResendOtpRequest {
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  photoUrl: string | null;
  isVerified: boolean;
}
