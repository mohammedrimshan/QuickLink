import { getMe } from "@/Service/urlService";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};