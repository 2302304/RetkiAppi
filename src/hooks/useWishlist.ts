'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { WishlistDestination } from '@/types/planning';

export function useWishlist() {
  const [destinations, setDestinations] = useState<WishlistDestination[]>([]);

  useEffect(() => {
    loadDestinations();
  }, []);

  async function loadDestinations() {
    const { data } = await supabase
      .from('wishlist_destinations')
      .select('*')
      .order('added_at', { ascending: false });

    if (data) {
      setDestinations(
        data.map((row) => ({
          id: row.id,
          name: row.name,
          parkId: row.park_id,
          location: row.location,
          priority: row.priority,
          season: row.season,
          notes: row.notes,
          estimatedDuration: row.estimated_duration,
          addedAt: row.added_at,
        }))
      );
    }
  }

  const addDestination = useCallback(
    async (dest: Omit<WishlistDestination, 'id' | 'addedAt'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return '';

      const { data, error } = await supabase
        .from('wishlist_destinations')
        .insert({
          user_id: userData.user.id,
          name: dest.name,
          park_id: dest.parkId,
          location: dest.location,
          priority: dest.priority,
          season: dest.season,
          notes: dest.notes,
          estimated_duration: dest.estimatedDuration,
        })
        .select()
        .single();

      if (data && !error) {
        const newDest: WishlistDestination = {
          id: data.id,
          name: data.name,
          parkId: data.park_id,
          location: data.location,
          priority: data.priority,
          season: data.season,
          notes: data.notes,
          estimatedDuration: data.estimated_duration,
          addedAt: data.added_at,
        };
        setDestinations((prev) => [newDest, ...prev]);
        return data.id;
      }
      return '';
    },
    []
  );

  const updateDestination = useCallback(
    async (id: string, updates: Partial<WishlistDestination>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.parkId !== undefined) dbUpdates.park_id = updates.parkId;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.season !== undefined) dbUpdates.season = updates.season;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.estimatedDuration !== undefined)
        dbUpdates.estimated_duration = updates.estimatedDuration;

      await supabase.from('wishlist_destinations').update(dbUpdates).eq('id', id);
      setDestinations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      );
    },
    []
  );

  const removeDestination = useCallback(async (id: string) => {
    await supabase.from('wishlist_destinations').delete().eq('id', id);
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const getDestination = useCallback(
    (id: string) => destinations.find((d) => d.id === id),
    [destinations]
  );

  return {
    destinations,
    addDestination,
    updateDestination,
    removeDestination,
    getDestination,
  };
}
