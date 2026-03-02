export type ForumPost = {
  post_id: number;
  user_id: number;
  user_name: string;
  park_id: number | null;
  park_name: string | null;
  title: string;
  body: string;
  comment_count: number;
  created_at: string;
  updated_at: string;
};

export type ForumComment = {
  comment_id: number;
  post_id: number;
  user_id: number;
  user_name: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type ForumPostDetail = ForumPost & {
  comments: ForumComment[];
};

export type CreateForumPost = {
  user_id: number;
  title: string;
  body: string;
  park_id?: number | null;
};

export type CreateForumComment = {
  user_id: number;
  body: string;
};
