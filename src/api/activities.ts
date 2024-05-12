import { Activity } from '@/types/activity';
import axios from 'axios';

export function getActivities() {
  return (
    axios
      .get('api/activities', { params: { _sort: 'name' } })
      .then((res) => res.data)
  );
}

export function getActivity(id: number) {
  return axios.get(`api/activities/${id}`).then((res) => res.data);
}

export function createActivity(activity: Activity) {
  return axios.post('api/activities', activity).then((res) => res.data);
}

export function updateActivity(id: number, { name, description }: Activity) {
  return axios
    .put<Activity>(`api/activities/${id}`, {
      name,
      description,
    })
    .then((res) => res.data);
}

export function deleteActivity(id: number) {
  return axios.delete(`api/activities/${id}`).then((res) => res.data);
}
