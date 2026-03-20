'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { StarRating } from '@/components/ui/StarRating';
import { cn } from '@/lib/utils';
import { Calendar, Clock, HelpCircle } from 'lucide-react';

type DateMode = 'exact' | 'approximate' | 'unknown';

interface VisitFormProps {
  onSubmit: (visitDate: string, notes?: string, rating?: number) => void;
  onCancel?: () => void;
}

export function VisitForm({ onSubmit, onCancel }: VisitFormProps) {
  const [dateMode, setDateMode] = useState<DateMode>('exact');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [approximateYear, setApproximateYear] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let date: string;
    if (dateMode === 'exact') {
      date = visitDate;
    } else if (dateMode === 'approximate' && approximateYear) {
      date = `${approximateYear}-01-01`;
    } else {
      date = '1970-01-01';
    }

    const notePrefix =
      dateMode === 'approximate'
        ? `[Käyty noin vuonna ${approximateYear}] `
        : dateMode === 'unknown'
        ? '[Tarkka ajankohta ei tiedossa] '
        : '';

    const fullNotes = notePrefix + (notes || '');

    onSubmit(date, fullNotes.trim() || undefined, rating || undefined);
  };

  const dateModes: { value: DateMode; label: string; icon: React.ElementType; desc: string }[] = [
    { value: 'exact', label: 'Tarkka päivä', icon: Calendar, desc: 'Tiedän päivämäärän' },
    { value: 'approximate', label: 'Noin vuonna', icon: Clock, desc: 'Muistan suunnilleen vuoden' },
    { value: 'unknown', label: 'En muista', icon: HelpCircle, desc: 'Käyty joskus aiemmin' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date mode selector */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Milloin kävit?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {dateModes.map((mode) => {
            const Icon = mode.icon;
            const selected = dateMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setDateMode(mode.value)}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg border text-xs transition-colors',
                  selected
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                )}
              >
                <Icon size={18} />
                <span className="font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date input based on mode */}
      {dateMode === 'exact' && (
        <Input
          id="visitDate"
          label="Käyntipäivä"
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          required
        />
      )}

      {dateMode === 'approximate' && (
        <div className="space-y-1">
          <label htmlFor="approxYear" className="block text-sm font-medium text-gray-700">
            Suunnilleen mikä vuosi?
          </label>
          <select
            id="approxYear"
            value={approximateYear}
            onChange={(e) => setApproximateYear(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Valitse vuosi...</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      {dateMode === 'unknown' && (
        <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          Ei hätää! Merkitään puisto käydyksi ilman tarkkaa ajankohtaa.
        </p>
      )}

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Arvosana
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <Textarea
        id="notes"
        label="Muistiinpanot (valinnainen)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Kerro kokemuksestasi..."
        rows={3}
      />
      <div className="flex gap-3">
        <Button type="submit">Merkitse käydyksi</Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Peruuta
          </Button>
        )}
      </div>
    </form>
  );
}
