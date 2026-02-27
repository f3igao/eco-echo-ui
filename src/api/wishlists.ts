import type { Wishlist } from '@/types/wishlist';
import axios from 'axios';

export function getWishlists() {
  return axios.get<{ wishlists: Wishlist[] }>('api/wishlists').then((res) => res.data);
}

export function getWishlistsByUserId(userId: number) {
  return axios
    .get<{ wishlists: Wishlist[] }>('api/wishlists', { params: { user_id: userId } })
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
