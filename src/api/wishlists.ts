import { Wishlist } from '@/types/wishlist';
import axios from 'axios';

export function getWishlists() {
  return axios.get('http://127.0.0.1:5000/wishlists').then((res) => res.data);
}

export function getWishlist(id: number) {
  return axios
    .get(`http://127.0.0.1:5000/wishlists/${id}`)
    .then((res) => res.data);
}

export function getWishlistsByUserId(userId: number) {
  return axios
    .get('http://127.0.0.1:5000/wishlists', { params: { user_id: userId } })
    .then((res) => res.data);
}

export function createWishlist({ user_id, activity_id }: Wishlist) {
  return axios
    .post('http://127.0.0.1:5000/wishlists', {
      user_id,
      activity_id,
      id: Date.now(),
    })
    .then((res) => res.data);
}

export function updateWishlist(
  id: number,
  { user_id, activity_id }: Wishlist
) {
  return axios
    .put<Wishlist>(`http://127.0.0.1:5000/wishlists/${id}`, {
      user_id,
      activity_id,
    })
    .then((res) => res.data);
}

export function deleteWishlist(id: number) {
  return axios
    .delete(`http://127.0.0.1:5000/wishlists/${id}`)
    .then((res) => res.data);
}
