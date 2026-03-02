import type { CreateParkReview, ParkReview } from '@/types/parkReview';
import axios from 'axios';

export function getParkReviews() {
  return axios
    .get('api/park-reviews', {
      params: { _sort: 'created_on', _order: 'desc' },
    })
    .then((res) => res.data);
}

export function getParkReviewsByPark(id: number, requesterId?: number) {
  return axios
    .get(`/api/park-reviews/park/${id}`, {
      params: { requester_id: requesterId },
    })
    .then((res) => res.data);
}

export function getParkReviewsByUser(userId: number, requesterId?: number) {
  return axios
    .get(`/api/park-reviews/user/${userId}`, {
      params: { requester_id: requesterId },
    })
    .then((res) => res.data);
}

export function getParkReview(id: number) {
  return axios.get(`api/park-reviews/${id}`).then((res) => res.data);
}

export function createParkReview(payload: CreateParkReview) {
  return axios.post<ParkReview>('api/park-reviews', payload).then((res) => res.data);
}

export function deleteParkReview(id: number) {
  return axios.delete(`api/park-reviews/${id}`).then((res) => res.data);
}
