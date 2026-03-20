'use client';

import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ParkVisit } from '@/types/park';
import { STORAGE_KEYS, TOTAL_PARKS } from '@/lib/constants';
import { generateId } from '@/lib/utils';

export function useParkVisits() {
  const [visits, setVisits] = useLocalStorage<ParkVisit[]>(
    STORAGE_KEYS.PARK_VISITS,
    []
  );

  const visitedParkIds = useMemo(
    () => new Set(visits.map((v) => v.parkId)),
    [visits]
  );

  const visitCount = visitedParkIds.size;
  const progress = Math.round((visitCount / TOTAL_PARKS) * 100);

  const addVisit = useCallback(
    (parkId: string, visitDate: string, notes?: string, rating?: number) => {
      const visit: ParkVisit = {
        id: generateId(),
        parkId,
        visitDate,
        notes,
        rating,
        createdAt: new Date().toISOString(),
      };
      setVisits((prev) => [...prev, visit]);
    },
    [setVisits]
  );

  const removeVisit = useCallback(
    (visitId: string) => {
      setVisits((prev) => prev.filter((v) => v.id !== visitId));
    },
    [setVisits]
  );

  const updateVisit = useCallback(
    (visitId: string, updates: Partial<ParkVisit>) => {
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, ...updates } : v))
      );
    },
    [setVisits]
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
