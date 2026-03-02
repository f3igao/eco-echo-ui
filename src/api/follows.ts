import type { Follow, FollowStatus, FollowUser } from '@/types/follow';
import axios from 'axios';

export function followUser(follower_id: number, following_id: number) {
  return axios
    .post<Follow>('/api/follows', { follower_id, following_id })
    .then((res) => res.data);
}

export function unfollowUser(follower_id: number, following_id: number) {
  return axios
    .delete('/api/follows', { data: { follower_id, following_id } })
    .then((res) => res.data);
}

export function getFollowers(user_id: number) {
  return axios
    .get<{ users: FollowUser[]; total: number }>(`/api/follows/followers/${user_id}`)
    .then((res) => res.data);
}

export function getFollowing(user_id: number) {
  return axios
    .get<{ users: FollowUser[]; total: number }>(`/api/follows/following/${user_id}`)
    .then((res) => res.data);
}

export function getFollowStatus(follower_id: number, following_id: number) {
  return axios
    .get<FollowStatus>('/api/follows/status', { params: { follower_id, following_id } })
    .then((res) => res.data);
}
