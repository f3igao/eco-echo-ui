export type Follow = {
  follow_id: number;
  follower_id: number;
  following_id: number;
  created_at: string;
};

export type FollowUser = {
  user_id: number;
  name: string;
  email: string;
  is_private: boolean;
};

export type FollowStatus = {
  is_following: boolean;
};
