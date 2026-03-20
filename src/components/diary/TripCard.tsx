'use client';

import Link from 'next/link';
import { TripEntry } from '@/types/diary';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate, formatDuration } from '@/lib/utils';
import { DIFFICULTY_LABELS, WEATHER_LABELS } from '@/lib/constants';
import { MapPin, Route, Clock, Calendar } from 'lucide-react';

interface TripCardProps {
  entry: TripEntry;
}

export function TripCard({ entry }: TripCardProps) {
  return (
    <Link href={`/paivakirja/${entry.id}`}>
      <Card hoverable>
        <CardContent>
          <div className="flex gap-4">
            {entry.photos[0] && (
              <img
                src={entry.photos[0].dataUrl}
                alt=""
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {entry.title}
                </h3>
                <StarRating value={entry.rating} readonly size={14} />
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {formatDate(entry.date)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {entry.locationName}
                </span>
                {entry.distanceKm && (
                  <span className="flex items-center gap-1">
                    <Route size={13} />
                    {entry.distanceKm} km
                  </span>
                )}
                {entry.durationMinutes && (
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {formatDuration(entry.durationMinutes)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {entry.weather && (
                  <Badge variant="info">{WEATHER_LABELS[entry.weather]}</Badge>
                )}
                {entry.difficulty && (
                  <Badge
                    variant={
                      entry.difficulty === 'helppo'
                        ? 'success'
                        : entry.difficulty === 'vaativa' || entry.difficulty === 'erittain-vaativa'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {DIFFICULTY_LABELS[entry.difficulty]}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
