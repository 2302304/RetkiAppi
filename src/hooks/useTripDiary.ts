'use client';

import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { TripEntry } from '@/types/diary';
import { STORAGE_KEYS } from '@/lib/constants';
import { generateId } from '@/lib/utils';

export function useTripDiary() {
  const [entries, setEntries] = useLocalStorage<TripEntry[]>(
    STORAGE_KEYS.TRIP_DIARY,
    []
  );

  const entriesByDate = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries]
  );

  const addEntry = useCallback(
    (entry: Omit<TripEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newEntry: TripEntry = {
        ...entry,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setEntries((prev) => [...prev, newEntry]);
      return newEntry.id;
    },
    [setEntries]
  );

  const updateEntry = useCallback(
    (id: string, updates: Partial<TripEntry>) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, ...updates, updatedAt: new Date().toISOString() }
            : e
        )
      );
    },
    [setEntries]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [setEntries]
  );

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
