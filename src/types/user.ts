export type User = {
  user_id: number;
  name: string;
  email: string;
  password: string;
  is_private: boolean;
  created_at: Date;
  updated_at: Date;
  follower_count?: number;
  following_count?: number;
};
