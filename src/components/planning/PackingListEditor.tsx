'use client';

import { useState } from 'react';
import { PackingList, PackingCategory } from '@/types/planning';
import { PACKING_CATEGORY_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Check, Plus, Trash2, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';

interface PackingListEditorProps {
  list: PackingList;
  onToggleItem: (itemId: string) => void;
  onAddItem: (item: { name: string; category: PackingCategory }) => void;
  onRemoveItem: (itemId: string) => void;
  onUncheckAll: () => void;
}

const categories: PackingCategory[] = [
  'vaatteet',
  'ruoka-juoma',
  'varusteet',
  'navigointi',
  'turvallisuus',
  'hygienia',
  'majoitus',
  'muut',
];

export function PackingListEditor({
  list,
  onToggleItem,
  onAddItem,
  onRemoveItem,
  onUncheckAll,
}: PackingListEditorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories)
  );
  const [addingCategory, setAddingCategory] = useState<PackingCategory | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const itemsByCategory = categories.map((cat) => ({
    category: cat,
    items: list.items.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0 || addingCategory === g.category);

  const totalItems = list.items.length;
  const checkedItems = list.items.filter((i) => i.checked).length;

  const handleAddItem = () => {
    if (!newItemName.trim() || !addingCategory) return;
    onAddItem({ name: newItemName.trim(), category: addingCategory });
    setNewItemName('');
    setAddingCategory(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">
          {checkedItems} / {totalItems} pakattu
        </div>
        {checkedItems > 0 && (
          <Button variant="ghost" size="sm" onClick={onUncheckAll}>
            <RotateCcw size={14} className="mr-1" />
            Nollaa
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-green-500 rounded-full h-2 transition-all"
          style={{ width: `${totalItems > 0 ? (checkedItems / totalItems) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-4">
        {itemsByCategory.map(({ category, items }) => {
          const expanded = expandedCategories.has(category);
          const catChecked = items.filter((i) => i.checked).length;

          return (
            <div key={category} className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  {PACKING_CATEGORY_LABELS[category]}
                </div>
                <span className="text-xs text-gray-400">
                  {catChecked}/{items.length}
                </span>
              </button>

              {expanded && (
                <div className="px-4 pb-3 space-y-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 py-1.5 group"
                    >
                      <button
                        type="button"
                        onClick={() => onToggleItem(item.id)}
                        className={cn(
                          'w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0',
                          item.checked
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300 hover:border-green-500'
                        )}
                      >
                        {item.checked && <Check size={14} className="text-white" />}
                      </button>
                      <span
                        className={cn(
                          'flex-1 text-sm',
                          item.checked && 'line-through text-gray-400'
                        )}
                      >
                        {item.name}
                        {item.quantity && item.quantity > 1 && (
                          <span className="text-gray-400 ml-1">
                            x{item.quantity}
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {addingCategory === category ? (
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Tavaran nimi..."
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddItem();
                          }
                        }}
                        autoFocus
                      />
                      <Button size="sm" onClick={handleAddItem}>
                        Lisää
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setAddingCategory(null);
                          setNewItemName('');
                        }}
                      >
                        Peruuta
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingCategory(category)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 mt-1"
                    >
                      <Plus size={14} />
                      Lisää tavara
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add to new category */}
      {!addingCategory && (
        <div className="mt-4">
          <select
            onChange={(e) => {
              if (e.target.value) {
                setAddingCategory(e.target.value as PackingCategory);
              }
            }}
            value=""
            className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-green-500 cursor-pointer"
          >
            <option value="">+ Lisää tavara kategoriaan...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {PACKING_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
