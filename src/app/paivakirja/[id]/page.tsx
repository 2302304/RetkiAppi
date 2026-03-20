'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTripDiary } from '@/hooks/useTripDiary';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatDateLong, formatDuration } from '@/lib/utils';
import { WEATHER_LABELS, DIFFICULTY_LABELS } from '@/lib/constants';
import { ArrowLeft, MapPin, Route, Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getEntry, deleteEntry } = useTripDiary();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const entry = getEntry(id);

  if (!entry) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Merkintää ei löytynyt
        </h1>
        <Link href="/paivakirja" className="text-green-700 hover:underline">
          Takaisin päiväkirjaan
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/paivakirja"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Takaisin
      </Link>

      <PageHeader
        title={entry.title}
        action={
          <div className="flex gap-2">
            <Link href={`/paivakirja/${entry.id}/muokkaa`}>
              <Button variant="secondary" size="sm">
                <Edit size={16} className="mr-1.5" />
                Muokkaa
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={16} className="mr-1.5" />
              Poista
            </Button>
          </div>
        }
      />

      <div className="max-w-3xl space-y-6">
        {/* Meta info */}
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar size={16} />
                {formatDateLong(entry.date)}
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <MapPin size={16} />
                {entry.locationName}
              </div>
              {entry.distanceKm && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Route size={16} />
                  {entry.distanceKm} km
                </div>
              )}
              {entry.durationMinutes && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock size={16} />
                  {formatDuration(entry.durationMinutes)}
                </div>
              )}
            </div>

            {entry.routeName && (
              <p className="text-sm text-gray-500 mt-2">
                Reitti: {entry.routeName}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <StarRating value={entry.rating} readonly size={18} />
              {entry.weather && (
                <Badge variant="info">{WEATHER_LABELS[entry.weather]}</Badge>
              )}
              {entry.difficulty && (
                <Badge>{DIFFICULTY_LABELS[entry.difficulty]}</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {entry.description && (
          <Card>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {entry.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Photos */}
        {entry.photos.length > 0 && (
          <Card>
            <CardContent>
              <h3 className="font-semibold text-gray-900 mb-3">Kuvat</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {entry.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.dataUrl}
                    alt="Retkikuva"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteEntry(entry.id);
          router.push('/paivakirja');
        }}
        title="Poista merkintä"
        message={`Haluatko varmasti poistaa merkinnän "${entry.title}"? Tätä toimintoa ei voi perua.`}
      />
    </div>
  );
}
