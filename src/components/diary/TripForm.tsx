'use client';

import { useState } from 'react';
import { TripEntry, TripPhoto, Weather, Difficulty } from '@/types/diary';
import { NATIONAL_PARKS } from '@/data/national-parks';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { WeatherSelector } from './WeatherSelector';
import { DifficultySelector } from './DifficultySelector';
import { PhotoUpload } from './PhotoUpload';

type TripFormData = Omit<TripEntry, 'id' | 'createdAt' | 'updatedAt'>;

interface TripFormProps {
  initialData?: Partial<TripFormData>;
  onSubmit: (data: TripFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function TripForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Tallenna',
}: TripFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [locationName, setLocationName] = useState(initialData?.locationName || '');
  const [parkId, setParkId] = useState(initialData?.parkId || '');
  const [routeName, setRouteName] = useState(initialData?.routeName || '');
  const [distanceKm, setDistanceKm] = useState(
    initialData?.distanceKm?.toString() || ''
  );
  const [durationHours, setDurationHours] = useState(
    initialData?.durationMinutes ? Math.floor(initialData.durationMinutes / 60).toString() : ''
  );
  const [durationMinutes, setDurationMinutes] = useState(
    initialData?.durationMinutes ? (initialData.durationMinutes % 60).toString() : ''
  );
  const [weather, setWeather] = useState<Weather | undefined>(initialData?.weather);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    initialData?.difficulty
  );
  const [rating, setRating] = useState(initialData?.rating || 3);
  const [description, setDescription] = useState(initialData?.description || '');
  const [photos, setPhotos] = useState<TripPhoto[]>(initialData?.photos || []);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const parkSuggestions = locationName.length >= 2
    ? NATIONAL_PARKS.filter((p) =>
        p.nameShort.toLowerCase().includes(locationName.toLowerCase()) ||
        p.name.toLowerCase().includes(locationName.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !locationName) return;

    const totalMinutes =
      (parseInt(durationHours || '0') * 60) + parseInt(durationMinutes || '0');

    onSubmit({
      title,
      date,
      locationName,
      parkId: parkId || undefined,
      routeName: routeName || undefined,
      distanceKm: distanceKm ? parseFloat(distanceKm) : undefined,
      durationMinutes: totalMinutes > 0 ? totalMinutes : undefined,
      weather,
      difficulty,
      rating,
      description,
      photos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="title"
        label="Otsikko *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Esim. Päiväretki Nuuksiossa"
        required
      />

      <Input
        id="date"
        label="Päivämäärä *"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="relative">
        <Input
          id="locationName"
          label="Sijainti / kohde *"
          value={locationName}
          onChange={(e) => {
            setLocationName(e.target.value);
            setParkId('');
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Esim. Nuuksio, Repovesi..."
          required
        />
        {showSuggestions && parkSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {parkSuggestions.map((park) => (
              <button
                key={park.id}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  setLocationName(park.nameShort);
                  setParkId(park.id);
                  setShowSuggestions(false);
                }}
              >
                <span className="font-medium">{park.nameShort}</span>
                <span className="text-gray-400 ml-2">{park.location}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Input
        id="routeName"
        label="Reitin nimi"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
        placeholder="Esim. Haukkalammen kierros"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Input
          id="distanceKm"
          label="Matka (km)"
          type="number"
          step="0.1"
          min="0"
          value={distanceKm}
          onChange={(e) => setDistanceKm(e.target.value)}
          placeholder="0.0"
        />
        <Input
          id="durationHours"
          label="Kesto (h)"
          type="number"
          min="0"
          value={durationHours}
          onChange={(e) => setDurationHours(e.target.value)}
          placeholder="0"
        />
        <Input
          id="durationMinutes"
          label="Kesto (min)"
          type="number"
          min="0"
          max="59"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          placeholder="0"
        />
      </div>

      <WeatherSelector value={weather} onChange={setWeather} />

      <DifficultySelector value={difficulty} onChange={setDifficulty} />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Arvosana</label>
        <StarRating value={rating} onChange={setRating} size={24} />
      </div>

      <Textarea
        id="description"
        label="Kuvaus / muistiinpanot"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Kerro retkestäsi..."
        rows={5}
      />

      <PhotoUpload photos={photos} onChange={setPhotos} />

      <div className="flex gap-3 pt-2">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Peruuta
        </Button>
      </div>
    </form>
  );
}
