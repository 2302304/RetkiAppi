'use client';

import { useState } from 'react';
import { WishlistDestination } from '@/types/planning';
import { Season } from '@/types/diary';
import { NATIONAL_PARKS } from '@/data/national-parks';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { SEASON_LABELS, PRIORITY_LABELS } from '@/lib/constants';

interface WishlistFormProps {
  initialData?: Partial<WishlistDestination>;
  onSubmit: (data: Omit<WishlistDestination, 'id' | 'addedAt'>) => void;
  onCancel: () => void;
}

export function WishlistForm({ initialData, onSubmit, onCancel }: WishlistFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [parkId, setParkId] = useState(initialData?.parkId || '');
  const [priority, setPriority] = useState<WishlistDestination['priority']>(
    initialData?.priority || 'normaali'
  );
  const [season, setSeason] = useState<Season | ''>(initialData?.season || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [estimatedDuration, setEstimatedDuration] = useState(
    initialData?.estimatedDuration || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      parkId: parkId || undefined,
      location: location || undefined,
      priority,
      season: season || undefined,
      notes: notes || undefined,
      estimatedDuration: estimatedDuration || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Kohteen nimi *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Esim. Pallas-Yllästunturin kansallispuisto"
        required
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Liittyy kansallispuistoon
        </label>
        <select
          value={parkId}
          onChange={(e) => {
            setParkId(e.target.value);
            if (e.target.value) {
              const park = NATIONAL_PARKS.find((p) => p.id === e.target.value);
              if (park && !name) setName(park.nameShort);
            }
          }}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">Ei liity puistoon</option>
          {NATIONAL_PARKS.map((park) => (
            <option key={park.id} value={park.id}>
              {park.nameShort}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="location"
        label="Sijainti"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Esim. Muonio, Lappi"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Prioriteetti</label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as WishlistDestination['priority'])
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Paras aika</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value as Season | '')}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Ei väliä</option>
            {Object.entries(SEASON_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        id="estimatedDuration"
        label="Arvioitu kesto"
        value={estimatedDuration}
        onChange={(e) => setEstimatedDuration(e.target.value)}
        placeholder="Esim. 2-3 päivää"
      />

      <Textarea
        id="notes"
        label="Muistiinpanot"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Miksi haluat käydä? Mitä tehdä?"
        rows={3}
      />

      <div className="flex gap-3">
        <Button type="submit">Tallenna</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Peruuta
        </Button>
      </div>
    </form>
  );
}
