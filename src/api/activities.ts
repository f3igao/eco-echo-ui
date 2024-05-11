import { Activity } from '@/types/activity';
import axios from 'axios';

export function getActivities() {
  return axios
    .get('http://127.0.0.1:5000/activities', { params: { _sort: 'name' } })
    .then((res) => res.data);
}

export function getActivity(id: number) {
  return axios
    .get(`http://127.0.0.1:5000/activities/${id}`)
    .then((res) => res.data);
}

export function createActivity(activity: Activity) {
  return axios
    .post('http://127.0.0.1:5000/activities', activity)
    .then((res) => res.data);
}

export function updateActivity(id: number, { name, description }: Activity) {
  return axios
    .put<Activity>(`http://127.0.0.1:5000/activities/${id}`, {
      name,
      description,
    })
    .then((res) => res.data);
}

export function deleteActivity(id: number) {
  return axios
    .delete(`http://127.0.0.1:5000/activities/${id}`)
    .then((res) => res.data);
}
