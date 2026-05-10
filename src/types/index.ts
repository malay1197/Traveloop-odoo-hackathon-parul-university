export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Trip {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  emoji: string;
  status: 'planning' | 'upcoming' | 'completed';
  budget: number;
  spent: number;
  created_at: string;
}

export interface ItineraryDay {
  id: number;
  trip_id: number;
  day_number: number;
  date: string | null;
  city: string | null;
}

export interface Activity {
  id: number;
  trip_id: number;
  day_id: number;
  time: string | null;
  name: string;
  type: 'travel' | 'sightseeing' | 'food' | 'experience' | 'culture';
  cost: number;
}
