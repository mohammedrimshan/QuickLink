import axios from "axios";


export const authAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH_URL,
  withCredentials: true,
});


