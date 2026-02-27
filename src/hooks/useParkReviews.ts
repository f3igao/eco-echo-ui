import { getParkReviewsByUser } from '@/api/park-reviews';
import type { ParkReview } from '@/types/parkReview';
import { useQuery } from '@tanstack/react-query';

export const PARK_REVIEWS_USER_QUERY_KEY = (userId: number) => ['park-reviews', 'user', userId];

export function useParkReviews(userId: number) {
  const queryKey = PARK_REVIEWS_USER_QUERY_KEY(userId);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      getParkReviewsByUser(userId).catch((err) => {
        if (err?.response?.status === 404) return { park_reviews: [] };
        throw err;
      }),
    staleTime: 5 * 60 * 1000,
  });

  const parkReviews: ParkReview[] = data?.park_reviews ?? [];

  function hasVisited(parkId: number) {
    return parkReviews.some((r) => r.park_id === parkId);
  }

  return {
    parkReviews,
    isLoading,
    hasVisited,
  };
}
