'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { TripEntry, TripPhoto } from '@/types/diary';

export function useTripDiary() {
  const [entries, setEntries] = useState<TripEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    const { data: entriesData } = await supabase
      .from('trip_entries')
      .select('*')
      .order('date', { ascending: false });

    if (!entriesData) return;

    // Load photos for all entries
    const entryIds = entriesData.map((e) => e.id);
    const { data: photosData } = await supabase
      .from('trip_photos')
      .select('*')
      .in('trip_entry_id', entryIds.length > 0 ? entryIds : ['__none__']);

    const photosByEntry = new Map<string, TripPhoto[]>();
    for (const row of photosData || []) {
      // Get signed URL for photo
      const { data: urlData } = await supabase.storage
        .from('trip-photos')
        .createSignedUrl(row.storage_path, 3600);

      const photo: TripPhoto = {
        id: row.id,
        dataUrl: urlData?.signedUrl || '',
        caption: row.caption,
        createdAt: row.created_at,
      };
      const existing = photosByEntry.get(row.trip_entry_id) || [];
      existing.push(photo);
      photosByEntry.set(row.trip_entry_id, existing);
    }

    setEntries(
      entriesData.map((row) => ({
        id: row.id,
        date: row.date,
        title: row.title,
        parkId: row.park_id,
        locationName: row.location_name,
        routeName: row.route_name,
        distanceKm: row.distance_km ? Number(row.distance_km) : undefined,
        durationMinutes: row.duration_minutes,
        weather: row.weather,
        difficulty: row.difficulty,
        rating: row.rating,
        description: row.description || '',
        photos: photosByEntry.get(row.id) || [],
        tags: row.tags,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    );
  }

  const entriesByDate = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries]
  );

  const addEntry = useCallback(
    async (entry: Omit<TripEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return '';

      const { data, error } = await supabase
        .from('trip_entries')
        .insert({
          user_id: userData.user.id,
          date: entry.date,
          title: entry.title,
          park_id: entry.parkId,
          location_name: entry.locationName,
          route_name: entry.routeName,
          distance_km: entry.distanceKm,
          duration_minutes: entry.durationMinutes,
          weather: entry.weather,
          difficulty: entry.difficulty,
          rating: entry.rating,
          description: entry.description,
          tags: entry.tags,
        })
        .select()
        .single();

      if (!data || error) return '';

      // Upload photos to storage
      const uploadedPhotos: TripPhoto[] = [];
      for (const photo of entry.photos) {
        if (!photo.dataUrl) continue;

        // Convert base64 to blob
        const response = await fetch(photo.dataUrl);
        const blob = await response.blob();
        const storagePath = `${userData.user.id}/${data.id}/${crypto.randomUUID()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('trip-photos')
          .upload(storagePath, blob, { contentType: 'image/jpeg' });

        if (!uploadError) {
          const { data: photoRow } = await supabase
            .from('trip_photos')
            .insert({
              user_id: userData.user.id,
              trip_entry_id: data.id,
              storage_path: storagePath,
              caption: photo.caption,
            })
            .select()
            .single();

          if (photoRow) {
            const { data: urlData } = await supabase.storage
              .from('trip-photos')
              .createSignedUrl(storagePath, 3600);

            uploadedPhotos.push({
              id: photoRow.id,
              dataUrl: urlData?.signedUrl || '',
              caption: photoRow.caption,
              createdAt: photoRow.created_at,
            });
          }
        }
      }

      const newEntry: TripEntry = {
        id: data.id,
        date: data.date,
        title: data.title,
        parkId: data.park_id,
        locationName: data.location_name,
        routeName: data.route_name,
        distanceKm: data.distance_km ? Number(data.distance_km) : undefined,
        durationMinutes: data.duration_minutes,
        weather: data.weather,
        difficulty: data.difficulty,
        rating: data.rating,
        description: data.description || '',
        photos: uploadedPhotos,
        tags: data.tags,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setEntries((prev) => [newEntry, ...prev]);
      return data.id;
    },
    []
  );

  const updateEntry = useCallback(
    async (id: string, updates: Partial<TripEntry>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.date !== undefined) dbUpdates.date = updates.date;
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.parkId !== undefined) dbUpdates.park_id = updates.parkId;
      if (updates.locationName !== undefined) dbUpdates.location_name = updates.locationName;
      if (updates.routeName !== undefined) dbUpdates.route_name = updates.routeName;
      if (updates.distanceKm !== undefined) dbUpdates.distance_km = updates.distanceKm;
      if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes;
      if (updates.weather !== undefined) dbUpdates.weather = updates.weather;
      if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
      if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

      await supabase.from('trip_entries').update(dbUpdates).eq('id', id);
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
        )
      );
    },
    []
  );

  const deleteEntry = useCallback(async (id: string) => {
    // Delete photos from storage first
    const { data: photos } = await supabase
      .from('trip_photos')
      .select('storage_path')
      .eq('trip_entry_id', id);

    if (photos && photos.length > 0) {
      await supabase.storage
        .from('trip-photos')
        .remove(photos.map((p) => p.storage_path));
    }

    await supabase.from('trip_entries').delete().eq('id', id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getEntry = useCallback(
    (id: string) => entries.find((e) => e.id === id),
    [entries]
  );

  return {
    entries,
    entriesByDate,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
  };
}
