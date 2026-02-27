export type ActivityReview = {
  activity_review_id?: number;
  activity_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  media_url?: string | null;
  is_private: boolean;
  created_at?: string;
  updated_at?: string;
};
