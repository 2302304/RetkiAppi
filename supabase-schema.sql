-- Aja tämä Supabase SQL Editorissa (koko tiedosto kerralla)

-- Park visits
CREATE TABLE park_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  park_id TEXT NOT NULL,
  visit_date DATE NOT NULL,
  notes TEXT,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE park_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own park visits" ON park_visits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trip entries (diary)
CREATE TABLE trip_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  park_id TEXT,
  location_name TEXT NOT NULL,
  route_name TEXT,
  distance_km NUMERIC(6,2),
  duration_minutes INTEGER,
  weather TEXT,
  difficulty TEXT,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE trip_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own trip entries" ON trip_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trip photos
CREATE TABLE trip_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_entry_id UUID NOT NULL REFERENCES trip_entries(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE trip_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own trip photos" ON trip_photos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Packing lists
CREATE TABLE packing_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'custom',
  trip_date DATE,
  destination TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE packing_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own packing lists" ON packing_lists FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Packing items
CREATE TABLE packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES packing_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'muut',
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  quantity SMALLINT,
  weight NUMERIC(6,2),
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own packing items" ON packing_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Wishlist destinations
CREATE TABLE wishlist_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  park_id TEXT,
  location TEXT,
  priority TEXT NOT NULL DEFAULT 'normaali',
  season TEXT,
  notes TEXT,
  estimated_duration TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE wishlist_destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own wishlist" ON wishlist_destinations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trip_entries_updated_at BEFORE UPDATE ON trip_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER packing_lists_updated_at BEFORE UPDATE ON packing_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('trip-photos', 'trip-photos', false);

CREATE POLICY "Users upload own photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'trip-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users view own photos" ON storage.objects FOR SELECT USING (bucket_id = 'trip-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own photos" ON storage.objects FOR DELETE USING (bucket_id = 'trip-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
