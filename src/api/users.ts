import axios from 'axios';

export function getUser(id: string) {
  return axios.get(`http://127.0.0.1:5000/users/${id}`).then((res) => res.data);
}
