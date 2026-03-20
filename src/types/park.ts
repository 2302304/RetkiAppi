export interface NationalPark {
  id: string;
  name: string;
  nameShort: string;
  location: string;
  province: string;
  area: number;
  established: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  highlights: string[];
  website: string;
}

export interface ParkVisit {
  id: string;
  parkId: string;
  visitDate: string;
  notes?: string;
  rating?: number;
  createdAt: string;
}

export type ParkVisitStatus = 'visited' | 'unvisited';

export interface ParkFilters {
  search: string;
  province: string | 'all';
  status: ParkVisitStatus | 'all';
  sortBy: 'name' | 'area' | 'established' | 'visitDate';
  sortOrder: 'asc' | 'desc';
}
