export type ParkReview = {
  park_review_id: number;
  comment: string;
  is_private: boolean;
  media_url: string | null;
  rating: string;
  park_id: number;
  user_id: number;
  visit_date: string;
  created_at?: string;
  updated_at: string;
};

export type CreateParkReview = {
  park_id: number;
  user_id: number;
  rating: number;
  visit_date: string;
  comment: string;
  media_url?: string | null;
  is_private: boolean;
};
