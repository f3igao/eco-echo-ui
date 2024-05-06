import { IUser } from '@/models/user.interface';
import axios from 'axios';

export function getUsers() {
  return axios
    .get('http://127.0.0.1:5000/users', { params: { _sort: 'name' } })
    .then((res) => res.data);
}

export function getUser(id: number) {
  return axios
    .get<IUser>(`http://127.0.0.1:5000/users/${id}`)
    .then((res) => res.data);
}

export function createUser(user: IUser) {
  return axios
    .post<IUser>('http://127.0.0.1:5000/users', user)
    .then((res) => res.data);
}

export function updateUser(id: number, user: IUser) {
  return axios
    .put<IUser>(`http://127.0.0.1:5000/users/${id}`, user)
    .then((res) => res.data);
}

export function deleteUser(id: number) {
  return axios
    .delete(`http://127.0.0.1:5000/users/${id}`)
    .then((res) => res.data);
}
