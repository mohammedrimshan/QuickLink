export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  phoneNumber?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  user?: IUserResponse;
  userId?: string;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}