'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { PackingList, PackingItem, PackingTemplateType, PackingCategory } from '@/types/planning';
import { PACKING_TEMPLATES } from '@/data/packing-templates';

export function usePackingLists() {
  const [lists, setLists] = useState<PackingList[]>([]);

  useEffect(() => {
    loadLists();
  }, []);

  async function loadLists() {
    const { data: listsData } = await supabase
      .from('packing_lists')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!listsData) return;

    const { data: itemsData } = await supabase
      .from('packing_items')
      .select('*')
      .order('sort_order');

    const itemsByList = new Map<string, PackingItem[]>();
    (itemsData || []).forEach((row) => {
      const item: PackingItem = {
        id: row.id,
        name: row.name,
        category: row.category as PackingCategory,
        checked: row.checked,
        quantity: row.quantity,
        weight: row.weight ? Number(row.weight) : undefined,
        notes: row.notes,
      };
      const existing = itemsByList.get(row.list_id) || [];
      existing.push(item);
      itemsByList.set(row.list_id, existing);
    });

    setLists(
      listsData.map((row) => ({
        id: row.id,
        name: row.name,
        templateType: row.template_type as PackingTemplateType,
        items: itemsByList.get(row.id) || [],
        tripDate: row.trip_date,
        destination: row.destination,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    );
  }

  const createFromTemplate = useCallback(
    async (templateType: PackingTemplateType, name: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return '';

      const template = PACKING_TEMPLATES.find((t) => t.type === templateType);

      const { data: listData, error } = await supabase
        .from('packing_lists')
        .insert({
          user_id: userData.user.id,
          name,
          template_type: templateType,
        })
        .select()
        .single();

      if (!listData || error) return '';

      const items = (template?.items || []).map((item, i) => ({
        user_id: userData.user!.id,
        list_id: listData.id,
        name: item.name,
        category: item.category,
        checked: false,
        quantity: item.quantity,
        sort_order: i,
      }));

      let insertedItems: PackingItem[] = [];
      if (items.length > 0) {
        const { data: itemsResult } = await supabase
          .from('packing_items')
          .insert(items)
          .select();

        insertedItems = (itemsResult || []).map((row) => ({
          id: row.id,
          name: row.name,
          category: row.category as PackingCategory,
          checked: row.checked,
          quantity: row.quantity,
          weight: row.weight ? Number(row.weight) : undefined,
          notes: row.notes,
        }));
      }

      const newList: PackingList = {
        id: listData.id,
        name: listData.name,
        templateType: listData.template_type as PackingTemplateType,
        items: insertedItems,
        tripDate: listData.trip_date,
        destination: listData.destination,
        notes: listData.notes,
        createdAt: listData.created_at,
        updatedAt: listData.updated_at,
      };

      setLists((prev) => [newList, ...prev]);
      return listData.id;
    },
    []
  );

  const createEmpty = useCallback(async (name: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return '';

    const { data, error } = await supabase
      .from('packing_lists')
      .insert({
        user_id: userData.user.id,
        name,
        template_type: 'custom',
      })
      .select()
      .single();

    if (!data || error) return '';

    const newList: PackingList = {
      id: data.id,
      name: data.name,
      templateType: 'custom',
      items: [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    setLists((prev) => [newList, ...prev]);
    return data.id;
  }, []);

  const deleteList = useCallback(async (id: string) => {
    await supabase.from('packing_lists').delete().eq('id', id);
    setLists((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateList = useCallback(
    async (id: string, updates: Partial<PackingList>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.tripDate !== undefined) dbUpdates.trip_date = updates.tripDate;
      if (updates.destination !== undefined) dbUpdates.destination = updates.destination;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      await supabase.from('packing_lists').update(dbUpdates).eq('id', id);
      setLists((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );
    },
    []
  );

  const addItem = useCallback(
    async (listId: string, item: Omit<PackingItem, 'id' | 'checked'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('packing_items')
        .insert({
          user_id: userData.user.id,
          list_id: listId,
          name: item.name,
          category: item.category,
          checked: false,
        })
        .select()
        .single();

      if (data && !error) {
        const newItem: PackingItem = {
          id: data.id,
          name: data.name,
          category: data.category as PackingCategory,
          checked: false,
        };
        setLists((prev) =>
          prev.map((l) =>
            l.id === listId ? { ...l, items: [...l.items, newItem] } : l
          )
        );
      }
    },
    []
  );

  const removeItem = useCallback(async (listId: string, itemId: string) => {
    await supabase.from('packing_items').delete().eq('id', itemId);
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? { ...l, items: l.items.filter((i) => i.id !== itemId) }
          : l
      )
    );
  }, []);

  const toggleItem = useCallback(async (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.map((i) =>
                i.id === itemId ? { ...i, checked: !i.checked } : i
              ),
            }
          : l
      )
    );

    // Find current state to determine new value
    const list = lists.find((l) => l.id === listId);
    const item = list?.items.find((i) => i.id === itemId);
    if (item) {
      await supabase
        .from('packing_items')
        .update({ checked: !item.checked })
        .eq('id', itemId);
    }
  }, [lists]);

  const uncheckAll = useCallback(async (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;

    const itemIds = list.items.map((i) => i.id);
    await supabase
      .from('packing_items')
      .update({ checked: false })
      .in('id', itemIds);

    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? { ...l, items: l.items.map((i) => ({ ...i, checked: false })) }
          : l
      )
    );
  }, [lists]);

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
