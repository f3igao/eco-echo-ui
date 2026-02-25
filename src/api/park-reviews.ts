import { ParkReview } from '@/types/parkReview';
import axios from 'axios';

export function getParkReviews() {
  return axios
    .get('api/park-reviews', {
      params: { _sort: 'created_on', _order: 'desc' },
    })
    .then((res) => res.data);
}

export function getParkReviewsByPark(id: number) {
  return axios
    .get(`/api/park-reviews/park/${id}`, {
      params: { _sort: 'created_on', _order: 'desc' },
    })
    .then((res) => res.data);
}

export function getParkReview(id: number) {
  return axios.get(`api/park-reviews/${id}`).then((res) => res.data);
}

export function createParkReview(park: ParkReview) {
  return axios.post('api/park-reviews', park).then((res) => res.data);
}

export function deleteParkReview(id: number) {
  return axios.delete(`api/park-reviews/${id}`).then((res) => res.data);
}
