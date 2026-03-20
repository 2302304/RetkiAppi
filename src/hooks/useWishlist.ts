'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { WishlistDestination } from '@/types/planning';
import { STORAGE_KEYS } from '@/lib/constants';
import { generateId } from '@/lib/utils';

export function useWishlist() {
  const [destinations, setDestinations] = useLocalStorage<WishlistDestination[]>(
    STORAGE_KEYS.WISHLIST,
    []
  );

  const addDestination = useCallback(
    (dest: Omit<WishlistDestination, 'id' | 'addedAt'>) => {
      const newDest: WishlistDestination = {
        ...dest,
        id: generateId(),
        addedAt: new Date().toISOString(),
      };
      setDestinations((prev) => [...prev, newDest]);
      return newDest.id;
    },
    [setDestinations]
  );

  const updateDestination = useCallback(
    (id: string, updates: Partial<WishlistDestination>) => {
      setDestinations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      );
    },
    [setDestinations]
  );

  const removeDestination = useCallback(
    (id: string) => {
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    },
    [setDestinations]
  );

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
