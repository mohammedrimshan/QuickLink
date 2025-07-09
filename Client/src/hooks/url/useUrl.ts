import { createUrl, getAnalytics, getUrls } from '@/Service/urlService';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';

export const useCreateUrl = () => {
  return useMutation({
    mutationFn: createUrl,
    onSuccess: (_data, _variables, _context) => {
      // Invalidate URLs query to refresh the list
      const queryClient = new QueryClient();
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
};

export const useGetUrls = () => {
  return useQuery({
    queryKey: ['urls'],
    queryFn: getUrls,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetAnalytics = (urlId: string) => {
  return useQuery({
    queryKey: ['analytics', urlId],
    queryFn: () => getAnalytics(urlId),
    enabled: !!urlId, // Only run if urlId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
