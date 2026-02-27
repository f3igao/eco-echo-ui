import {
  createWishlist,
  deleteWishlistByUserAndPark,
  getWishlistsByUserId,
  updateWishlist,
} from '@/api/wishlist';
import type { Wishlist } from '@/types/wishlist';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useWishlist(userId: number) {
  const queryClient = useQueryClient();
  const queryKey = ['wishlists', 'user', userId];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      getWishlistsByUserId(userId).catch((err) => {
        if (err?.response?.status === 404) return { wishlists: [] };
        throw err;
      }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const wishlists: Wishlist[] = data?.wishlists ?? [];

  function isWishlisted(parkId: number) {
    return wishlists.some((w) => w.park_id === parkId);
  }

  function getWishlistEntry(parkId: number) {
    return wishlists.find((w) => w.park_id === parkId);
  }

  const addMutation = useMutation({
    mutationFn: (parkId: number) => createWishlist({ user_id: userId, park_id: parkId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: (parkId: number) => deleteWishlistByUserAndPark(userId, parkId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  function removeWishlist(parkId: number) {
    if (!userId) return;
    removeMutation.mutate(parkId);
  }

  function toggleWishlist(parkId: number) {
    if (!userId) return;
    if (isWishlisted(parkId)) {
      removeMutation.mutate(parkId);
    } else {
      addMutation.mutate(parkId);
    }
  }

  const updateMutation = useMutation({
    mutationFn: ({
      wishlistId,
      data,
    }: {
      wishlistId: number;
      data: { planned_date_start?: string | null; planned_date_end?: string | null; notes?: string | null };
    }) => updateWishlist(wishlistId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    wishlists,
    isLoading,
    isWishlisted,
    getWishlistEntry,
    toggleWishlist,
    removeWishlist,
    updateWishlist: updateMutation.mutate,
    isToggling: addMutation.isPending || removeMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
