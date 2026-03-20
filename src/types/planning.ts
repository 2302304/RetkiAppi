import { Season } from './diary';

export type PackingCategory =
  | 'vaatteet'
  | 'ruoka-juoma'
  | 'varusteet'
  | 'navigointi'
  | 'turvallisuus'
  | 'hygienia'
  | 'majoitus'
  | 'muut';

export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategory;
  checked: boolean;
  quantity?: number;
  weight?: number;
  notes?: string;
}

export type PackingTemplateType =
  | 'paivaretki'
  | 'yopyminen'
  | 'talviretki'
  | 'custom';

export interface PackingList {
  id: string;
  name: string;
  templateType: PackingTemplateType;
  items: PackingItem[];
  tripDate?: string;
  destination?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistDestination {
  id: string;
  name: string;
  parkId?: string;
  location?: string;
  priority: 'matala' | 'normaali' | 'korkea';
  season?: Season;
  notes?: string;
  estimatedDuration?: string;
  addedAt: string;
}
