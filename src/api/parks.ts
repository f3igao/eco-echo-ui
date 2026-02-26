import type { Park } from '@/types/park';
import axios from 'axios';

const PAGE_SIZE = 12;

export function getParks({
  limit = PAGE_SIZE,
  offset = 0,
}: { limit?: number; offset?: number } = {}) {
  return axios
    .get('api/parks', { params: { limit, offset } })
    .then((res) => res.data);
}

export function getPark(id: number) {
  return axios.get(`api/parks/${id}`).then((res) => res.data);
}

export function createPark(park: Park) {
  return axios.post('api/parks', park).then((res) => res.data);
}

export function updatePark(id: number, { name, location }: Park) {
  return axios
    .put<Park>(`api/parks/${id}`, {
      name,
      location,
    })
    .then((res) => res.data);
}

export function deletePark(id: number) {
  return axios.delete(`api/parks/${id}`).then((res) => res.data);
}
