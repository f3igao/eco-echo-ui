export type ParkReview = {
  park_review_id: number;
  comment: string;
  is_private: boolean;
  media_url: string | null;
  rating: string;
  park_id: number;
  user_id: number;
  created_at?: string;
  updated_at: string;
};
