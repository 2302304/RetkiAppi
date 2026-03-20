'use client';

import Link from 'next/link';
import { NationalPark } from '@/types/park';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Calendar, Ruler } from 'lucide-react';

interface ParkCardProps {
  park: NationalPark;
  isVisited: boolean;
  visitDate?: string;
}

export function ParkCard({ park, isVisited, visitDate }: ParkCardProps) {
  return (
    <Link href={`/kansallispuistot/${park.id}`}>
      <Card hoverable className="h-full">
        <CardContent>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{park.nameShort}</h3>
            <Badge variant={isVisited ? 'success' : 'default'}>
              {isVisited ? 'Käyty' : 'Käymättä'}
            </Badge>
          </div>
          <div className="space-y-1.5 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{park.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Ruler size={14} />
                <span>{park.area} km²</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>Per. {park.established}</span>
              </div>
            </div>
            {isVisited && visitDate && (
              <p className="text-green-600 text-xs mt-1">
                Käyty: {new Intl.DateTimeFormat('fi-FI').format(new Date(visitDate))}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
