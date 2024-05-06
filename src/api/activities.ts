import { IActivity } from '@/models/activity.interface';
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

export function createActivity(activity: IActivity) {
  return axios
    .post('http://127.0.0.1:5000/activities', activity)
    .then((res) => res.data);
}

export function updateActivity(id: number, { name, description }: IActivity) {
  return axios
    .put<IActivity>(`http://127.0.0.1:5000/activities/${id}`, {
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
