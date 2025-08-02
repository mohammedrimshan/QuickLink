import { privateAxiosInstance } from "@/api/privateAxios.Instance";
import type { ApiResponse } from "@/types/ResponseType";
import type { CreateUrlRequest, URLAnalytics, URLDocument } from "@/types/UrlTypes";
import type { User } from "@/types/UserTypes";

export const createUrl = async (data: CreateUrlRequest): Promise<URLDocument> => {
  const response = await privateAxiosInstance.post<ApiResponse<URLDocument>>('/', data);
  return response.data.data;
};

export const getUrls = async (): Promise<URLDocument[]> => {
  const response = await privateAxiosInstance.get<ApiResponse<URLDocument[]>>('/');
  return response.data.data;
};

export const getAnalytics = async (urlId: string): Promise<URLAnalytics> => {
  const response = await privateAxiosInstance.get<ApiResponse<URLAnalytics>>(`/analytics/${urlId}`);
  return response.data.data;
};

export const getMe = async (): Promise<User> => {
  const response = await privateAxiosInstance.get<ApiResponse<User>>('/me');
  return response.data.data;
};

export const searchUrls = async (query: string): Promise<URLDocument[]> => {
  const response = await privateAxiosInstance.get<ApiResponse<URLDocument[]>>(
    `/search?query=${encodeURIComponent(query)}`
  );
  return response.data.data;
};