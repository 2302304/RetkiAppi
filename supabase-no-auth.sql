-- Aja tämä Supabase SQL Editorissa
-- Poistaa autentikaatiovaatimuksen ja sallii anonyymin pääsyn

-- Poista vanhat RLS policyt
DROP POLICY IF EXISTS "Users manage own park visits" ON park_visits;
DROP POLICY IF EXISTS "Users manage own trip entries" ON trip_entries;
DROP POLICY IF EXISTS "Users manage own trip photos" ON trip_photos;
DROP POLICY IF EXISTS "Users manage own packing lists" ON packing_lists;
DROP POLICY IF EXISTS "Users manage own packing items" ON packing_items;
DROP POLICY IF EXISTS "Users manage own wishlist" ON wishlist_destinations;
DROP POLICY IF EXISTS "Users upload own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users view own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own photos" ON storage.objects;

-- Poista user_id NOT NULL -rajoitus ja foreign key auth.users-tauluun
ALTER TABLE park_visits ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE park_visits DROP CONSTRAINT IF EXISTS park_visits_user_id_fkey;

ALTER TABLE trip_entries ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE trip_entries DROP CONSTRAINT IF EXISTS trip_entries_user_id_fkey;

ALTER TABLE trip_photos ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE trip_photos DROP CONSTRAINT IF EXISTS trip_photos_user_id_fkey;

ALTER TABLE packing_lists ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE packing_lists DROP CONSTRAINT IF EXISTS packing_lists_user_id_fkey;

ALTER TABLE packing_items ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE packing_items DROP CONSTRAINT IF EXISTS packing_items_user_id_fkey;

ALTER TABLE wishlist_destinations ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE wishlist_destinations DROP CONSTRAINT IF EXISTS wishlist_destinations_user_id_fkey;

-- Luo uudet avoimet policyt (sallii kaiken anon-roolille)
CREATE POLICY "Allow all park_visits" ON park_visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all trip_entries" ON trip_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all trip_photos" ON trip_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all packing_lists" ON packing_lists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all packing_items" ON packing_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all wishlist_destinations" ON wishlist_destinations FOR ALL USING (true) WITH CHECK (true);

-- Storage: salli anonyymi pääsy kuviin
CREATE POLICY "Allow all photo uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'trip-photos');
CREATE POLICY "Allow all photo views" ON storage.objects FOR SELECT USING (bucket_id = 'trip-photos');
CREATE POLICY "Allow all photo deletes" ON storage.objects FOR DELETE USING (bucket_id = 'trip-photos');

-- Poista vanhat käyttäjät (valinnainen)
DELETE FROM auth.users;
