'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ParkVisit } from '@/types/park';
import { TOTAL_PARKS } from '@/lib/constants';

export function useParkVisits() {
  const [visits, setVisits] = useState<ParkVisit[]>([]);

  useEffect(() => {
    loadVisits();
  }, []);

  async function loadVisits() {
    const { data } = await supabase
      .from('park_visits')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setVisits(
        data.map((row) => ({
          id: row.id,
          parkId: row.park_id,
          visitDate: row.visit_date,
          notes: row.notes,
          rating: row.rating,
          createdAt: row.created_at,
        }))
      );
    }
  }

  const visitedParkIds = useMemo(
    () => new Set(visits.map((v) => v.parkId)),
    [visits]
  );

  const visitCount = visitedParkIds.size;
  const progress = Math.round((visitCount / TOTAL_PARKS) * 100);

  const addVisit = useCallback(
    async (parkId: string, visitDate: string, notes?: string, rating?: number) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('park_visits')
        .insert({
          user_id: userData.user.id,
          park_id: parkId,
          visit_date: visitDate,
          notes,
          rating,
        })
        .select()
        .single();

      if (data && !error) {
        setVisits((prev) => [
          ...prev,
          {
            id: data.id,
            parkId: data.park_id,
            visitDate: data.visit_date,
            notes: data.notes,
            rating: data.rating,
            createdAt: data.created_at,
          },
        ]);
      }
    },
    []
  );

  const removeVisit = useCallback(async (visitId: string) => {
    await supabase.from('park_visits').delete().eq('id', visitId);
    setVisits((prev) => prev.filter((v) => v.id !== visitId));
  }, []);

  const updateVisit = useCallback(
    async (visitId: string, updates: Partial<ParkVisit>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.visitDate) dbUpdates.visit_date = updates.visitDate;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.rating !== undefined) dbUpdates.rating = updates.rating;

      await supabase.from('park_visits').update(dbUpdates).eq('id', visitId);
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, ...updates } : v))
      );
    },
    []
  );

  const getVisitForPark = useCallback(
    (parkId: string) => visits.find((v) => v.parkId === parkId),
    [visits]
  );

  const isVisited = useCallback(
    (parkId: string) => visitedParkIds.has(parkId),
    [visitedParkIds]
  );

  return {
    visits,
    visitedParkIds,
    visitCount,
    progress,
    addVisit,
    removeVisit,
    updateVisit,
    getVisitForPark,
    isVisited,
  };
}
