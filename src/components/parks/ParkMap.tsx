'use client';

import dynamic from 'next/dynamic';
import { NationalPark } from '@/types/park';

const ParkMapInner = dynamic(() => import('./ParkMapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Ladataan karttaa...</span>
    </div>
  ),
});

interface ParkMapProps {
  parks: NationalPark[];
  visitedParkIds: Set<string>;
}

export function ParkMap({ parks, visitedParkIds }: ParkMapProps) {
  return <ParkMapInner parks={parks} visitedParkIds={visitedParkIds} />;
}
