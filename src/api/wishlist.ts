import type { Wishlist } from '@/types/wishlist';
import axios from 'axios';

export function getWishlistsByUserId(userId: number, requesterId?: number) {
  return axios
    .get<{ wishlists: Wishlist[] }>(`api/wishlists/user/${userId}`, {
      params: requesterId ? { requester_id: requesterId } : undefined,
    })
    .then((res) => res.data);
}

export function createWishlist({ user_id, park_id }: Pick<Wishlist, 'user_id' | 'park_id'>) {
  return axios
    .post<Wishlist>('api/wishlists', { user_id, park_id })
    .then((res) => res.data);
}

export function deleteWishlist(wishlistId: number) {
  return axios.delete(`api/wishlists/${wishlistId}`).then((res) => res.data);
}

export function deleteWishlistByUserAndPark(userId: number, parkId: number) {
  return axios
    .delete(`api/wishlists/user/${userId}/park/${parkId}`)
    .then((res) => res.data);
}

export function updateWishlist(
  wishlistId: number,
  data: { planned_date_start?: string | null; planned_date_end?: string | null; notes?: string | null }
) {
  return axios
    .patch<Wishlist>(`api/wishlists/${wishlistId}`, data)
    .then((res) => res.data);
}
