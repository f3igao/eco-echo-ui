import type { CreateForumComment, CreateForumPost, ForumComment, ForumPost, ForumPostDetail } from '@/types/forum';
import axios from 'axios';

export function getForumPosts(params?: { park_id?: number; search?: string; limit?: number; offset?: number }) {
  return axios
    .get<{ posts: ForumPost[]; total: number }>('/api/forum/posts', { params })
    .then((res) => res.data);
}

export function getForumPost(post_id: number) {
  return axios
    .get<ForumPostDetail>(`/api/forum/posts/${post_id}`)
    .then((res) => res.data);
}

export function createForumPost(data: CreateForumPost) {
  return axios
    .post<ForumPost>('/api/forum/posts', data)
    .then((res) => res.data);
}

export function deleteForumPost(post_id: number, user_id: number) {
  return axios
    .delete(`/api/forum/posts/${post_id}`, { params: { user_id } })
    .then((res) => res.data);
}

export function createForumComment(post_id: number, data: CreateForumComment) {
  return axios
    .post<ForumComment>(`/api/forum/posts/${post_id}/comments`, data)
    .then((res) => res.data);
}

export function deleteForumComment(comment_id: number, user_id: number) {
  return axios
    .delete(`/api/forum/comments/${comment_id}`, { params: { user_id } })
    .then((res) => res.data);
}
