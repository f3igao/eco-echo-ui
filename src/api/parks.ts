import { IPark } from '@/models/park.interface';
import axios from 'axios';

export function getParks() {
  return axios
    .get('http://127.0.0.1:5000/parks', {
      params: { _sort: 'created_on', _order: 'desc' },
    })
    .then((res) => res.data);
}

export function getPark(id: number) {
  return axios.get(`http://127.0.0.1:5000/parks/${id}`).then((res) => res.data);
}

export function createPark(park: IPark) {
  console.log(JSON.stringify(park));
  return axios
    .post('http://127.0.0.1:5000/parks', park)
    .then((res) => res.data);
}

export function updatePark(id: number, { name, location }: IPark) {
  return axios
    .put<IPark>(`http://127.0.0.1:5000/parks/${id}`, {
      name,
      location,
    })
    .then((res) => res.data);
}

export function deletePark(id: number) {
  return axios
    .delete(`http://127.0.0.1:5000/parks/${id}`)
    .then((res) => res.data);
}

// export function getParksPaginated(page) {
//   return axios
//     .get("http://127.0.0.1:5000/parks", {
//       params: { _page: page, _sort: "title", _limit: 2 },
//     })
//     .then(res => {
//       const hasNext = page * 2 <= parseInt(res.headers["x-total-count"])
//       return {
//         nextPage: hasNext ? page + 1 : undefined,
//         previousPage: page > 1 ? page - 1 : undefined,
//         parks: res.data,
//       }
//     })
// }
