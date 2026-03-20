export const STORAGE_KEYS = {
  PARK_VISITS: 'retkeilysovellus-park-visits',
  TRIP_DIARY: 'retkeilysovellus-trip-diary',
  PACKING_LISTS: 'retkeilysovellus-packing-lists',
  WISHLIST: 'retkeilysovellus-wishlist',
} as const;

export const TOTAL_PARKS = 41;

export const WEATHER_LABELS: Record<string, string> = {
  aurinkoinen: 'Aurinkoinen',
  puolipilvinen: 'Puolipilvinen',
  pilvinen: 'Pilvinen',
  sateinen: 'Sateinen',
  luminen: 'Luminen',
  tuulinen: 'Tuulinen',
  sumuinen: 'Sumuinen',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  helppo: 'Helppo',
  keskivaikea: 'Keskivaikea',
  vaativa: 'Vaativa',
  'erittain-vaativa': 'Erittäin vaativa',
};

export const SEASON_LABELS: Record<string, string> = {
  kevat: 'Kevät',
  kesa: 'Kesä',
  syksy: 'Syksy',
  talvi: 'Talvi',
};

export const PACKING_CATEGORY_LABELS: Record<string, string> = {
  vaatteet: 'Vaatteet',
  'ruoka-juoma': 'Ruoka ja juoma',
  varusteet: 'Varusteet',
  navigointi: 'Navigointi',
  turvallisuus: 'Turvallisuus',
  hygienia: 'Hygienia',
  majoitus: 'Majoitus',
  muut: 'Muut',
};

export const PRIORITY_LABELS: Record<string, string> = {
  matala: 'Matala',
  normaali: 'Normaali',
  korkea: 'Korkea',
};
