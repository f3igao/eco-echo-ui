import type { ActivityReview } from '@/types/activityReview';
import axios from 'axios';

export function createActivityReview(review: Omit<ActivityReview, 'activity_review_id'>) {
  return axios.post('api/activity-reviews', review).then((res) => res.data);
}
