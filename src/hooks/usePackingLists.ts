'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { PackingList, PackingItem, PackingTemplateType } from '@/types/planning';
import { STORAGE_KEYS } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import { PACKING_TEMPLATES } from '@/data/packing-templates';

export function usePackingLists() {
  const [lists, setLists] = useLocalStorage<PackingList[]>(
    STORAGE_KEYS.PACKING_LISTS,
    []
  );

  const createFromTemplate = useCallback(
    (templateType: PackingTemplateType, name: string) => {
      const template = PACKING_TEMPLATES.find((t) => t.type === templateType);
      const now = new Date().toISOString();
      const newList: PackingList = {
        id: generateId(),
        name,
        templateType,
        items: (template?.items || []).map((item) => ({
          ...item,
          id: generateId(),
          checked: false,
        })),
        createdAt: now,
        updatedAt: now,
      };
      setLists((prev) => [...prev, newList]);
      return newList.id;
    },
    [setLists]
  );

  const createEmpty = useCallback(
    (name: string) => {
      const now = new Date().toISOString();
      const newList: PackingList = {
        id: generateId(),
        name,
        templateType: 'custom',
        items: [],
        createdAt: now,
        updatedAt: now,
      };
      setLists((prev) => [...prev, newList]);
      return newList.id;
    },
    [setLists]
  );

  const deleteList = useCallback(
    (id: string) => {
      setLists((prev) => prev.filter((l) => l.id !== id));
    },
    [setLists]
  );

  const updateList = useCallback(
    (id: string, updates: Partial<PackingList>) => {
      setLists((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, ...updates, updatedAt: new Date().toISOString() }
            : l
        )
      );
    },
    [setLists]
  );

  const addItem = useCallback(
    (listId: string, item: Omit<PackingItem, 'id' | 'checked'>) => {
      setLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? {
                ...l,
                items: [...l.items, { ...item, id: generateId(), checked: false }],
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );
    },
    [setLists]
  );

  const removeItem = useCallback(
    (listId: string, itemId: string) => {
      setLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? {
                ...l,
                items: l.items.filter((i) => i.id !== itemId),
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );
    },
    [setLists]
  );

  const toggleItem = useCallback(
    (listId: string, itemId: string) => {
      setLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? {
                ...l,
                items: l.items.map((i) =>
                  i.id === itemId ? { ...i, checked: !i.checked } : i
                ),
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );
    },
    [setLists]
  );

  const uncheckAll = useCallback(
    (listId: string) => {
      setLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? {
                ...l,
                items: l.items.map((i) => ({ ...i, checked: false })),
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );
    },
    [setLists]
  );

  const getList = useCallback(
    (id: string) => lists.find((l) => l.id === id),
    [lists]
  );

  return {
    lists,
    createFromTemplate,
    createEmpty,
    deleteList,
    updateList,
    addItem,
    removeItem,
    toggleItem,
    uncheckAll,
    getList,
  };
}
