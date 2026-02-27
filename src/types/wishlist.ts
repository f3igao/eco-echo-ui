export type Wishlist = {
  wishlist_id: number;
  user_id: number;
  park_id: number;
  created_at: Date;
  planned_date_start?: string | null;
  planned_date_end?: string | null;
  notes?: string | null;
};
