import axios from 'axios';

export interface Activity {
  id: number;
  title: string;
  body: string;
}

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

export function createActivity({ title, body }: Activity) {
  return axios
    .post('http://127.0.0.1:5000/activities', {
      title,
      body,
      userId: 1,
      id: Date.now(),
    })
    .then((res) => res.data);
}

export function updateActivity(id: number, { title, body }: Activity) {
  return axios
    .put<Activity>(`http://127.0.0.1:5000/activities/${id}`, {
      title,
      body,
    })
    .then((res) => res.data);
}

export function deleteActivity(id: number) {
  return axios
    .delete(`http://127.0.0.1:5000/activities/${id}`)
    .then((res) => res.data);
}
