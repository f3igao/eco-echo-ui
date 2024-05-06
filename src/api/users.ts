import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
}

export function getUsers() {
  return axios
    .get<User[]>('http://127.0.0.1:5000/users')
    .then((res) => res.data);
}

export function getUser(id: number) {
  return axios
    .get<User>(`http://127.0.0.1:5000/users/${id}`)
    .then((res) => res.data);
}

export function createUser(user: User) {
  return axios
    .post<User>('http://127.0.0.1:5000/users', user)
    .then((res) => res.data);
}

export function updateUser(id: number, user: User) {
  return axios
    .put<User>(`http://127.0.0.1:5000/users/${id}`, user)
    .then((res) => res.data);
}

export function deleteUser(id: number) {
  return axios
    .delete(`http://127.0.0.1:5000/users/${id}`)
    .then((res) => res.data);
}
