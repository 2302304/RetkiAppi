'use client';

import { Difficulty } from '@/types/diary';
import { cn } from '@/lib/utils';

const difficultyOptions: { value: Difficulty; label: string; color: string }[] = [
  { value: 'helppo', label: 'Helppo', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'keskivaikea', label: 'Keskivaikea', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 'vaativa', label: 'Vaativa', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'erittain-vaativa', label: 'Erittäin vaativa', color: 'bg-red-100 text-red-700 border-red-300' },
];

interface DifficultySelectorProps {
  value?: Difficulty;
  onChange: (value: Difficulty | undefined) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">Vaikeustaso</label>
      <div className="flex flex-wrap gap-2">
        {difficultyOptions.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(selected ? undefined : option.value)}
              className={cn(
                'px-3 py-1.5 rounded-full border text-sm font-medium transition-colors',
                selected
                  ? option.color
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
