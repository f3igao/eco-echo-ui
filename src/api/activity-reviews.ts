import type { ActivityReview, CreateActivityReview } from '@/types/activityReview';
import axios from 'axios';

export function createActivityReview(payload: CreateActivityReview) {
  return axios.post<ActivityReview>('api/activity-reviews', payload).then((res) => res.data);
}
