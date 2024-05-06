export interface IActivity {
  activity_id: number;
  park_id: number;
  name: string;
  description: string;
  duration: number;
  difficulty: number;
  require_special_equipment: boolean;
  created_at: Date;
  updated_at: Date;
}
