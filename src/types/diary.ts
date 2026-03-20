export type Weather =
  | 'aurinkoinen'
  | 'puolipilvinen'
  | 'pilvinen'
  | 'sateinen'
  | 'luminen'
  | 'tuulinen'
  | 'sumuinen';

export type Difficulty =
  | 'helppo'
  | 'keskivaikea'
  | 'vaativa'
  | 'erittain-vaativa';

export type Season = 'kevat' | 'kesa' | 'syksy' | 'talvi';

export interface TripEntry {
  id: string;
  date: string;
  title: string;
  parkId?: string;
  locationName: string;
  routeName?: string;
  distanceKm?: number;
  durationMinutes?: number;
  weather?: Weather;
  difficulty?: Difficulty;
  rating: number;
  description: string;
  photos: TripPhoto[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TripPhoto {
  id: string;
  dataUrl: string;
  caption?: string;
  createdAt: string;
}

export interface TripStats {
  totalTrips: number;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  averageDistanceKm: number;
  averageRating: number;
  tripsPerMonth: Record<string, number>;
  tripsPerYear: Record<string, number>;
  favoriteParks: Array<{ parkId: string; count: number }>;
  longestTrip: TripEntry | null;
  difficultyDistribution: Record<string, number>;
  weatherDistribution: Record<string, number>;
}
