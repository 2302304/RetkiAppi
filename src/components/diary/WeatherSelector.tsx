'use client';

import { Weather } from '@/types/diary';
import { cn } from '@/lib/utils';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudFog, CloudSun } from 'lucide-react';

const weatherOptions: { value: Weather; label: string; icon: React.ElementType }[] = [
  { value: 'aurinkoinen', label: 'Aurinkoinen', icon: Sun },
  { value: 'puolipilvinen', label: 'Puolipilvinen', icon: CloudSun },
  { value: 'pilvinen', label: 'Pilvinen', icon: Cloud },
  { value: 'sateinen', label: 'Sateinen', icon: CloudRain },
  { value: 'luminen', label: 'Luminen', icon: CloudSnow },
  { value: 'tuulinen', label: 'Tuulinen', icon: Wind },
  { value: 'sumuinen', label: 'Sumuinen', icon: CloudFog },
];

interface WeatherSelectorProps {
  value?: Weather;
  onChange: (value: Weather | undefined) => void;
}

export function WeatherSelector({ value, onChange }: WeatherSelectorProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">Sää</label>
      <div className="flex flex-wrap gap-2">
        {weatherOptions.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(selected ? undefined : option.value)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs transition-colors',
                selected
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <Icon size={20} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
