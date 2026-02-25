import type { User } from '@/types/user';
import axios from 'axios';

export type SignUpData = {
  name: string;
  email: string;
  password: string;
};

export function signUp(data: SignUpData) {
  return axios.post<User>('/api/auth/register', data).then((res) => res.data);
}

export function getUsers() {
  return axios
    .get('api/users', { params: { _sort: 'name' } })
    .then((res) => res.data);
}

export function getUser(id: number) {
  return axios.get<User>(`api/users/${id}`).then((res) => res.data);
}

export function createUser(user: User) {
  return axios.post<User>('api/users', user).then((res) => res.data);
}

export function updateUser(id: number, user: User) {
  return axios.put<User>(`api/users/${id}`, user).then((res) => res.data);
}

export function deleteUser(id: number) {
  return axios.delete(`api/users/${id}`).then((res) => res.data);
}
