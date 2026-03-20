'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { ParkMap } from '@/components/parks/ParkMap';
import { useParkVisits } from '@/hooks/useParkVisits';
import { NATIONAL_PARKS, TOTAL_PARKS } from '@/data/national-parks';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { List } from 'lucide-react';

export default function KarttaPage() {
  const { visitedParkIds, visitCount } = useParkVisits();

  return (
    <div>
      <PageHeader
        title="Karttanäkymä"
        description="Kansallispuistot kartalla"
        action={
          <Link href="/kansallispuistot">
            <Button variant="secondary" size="sm">
              <List size={16} className="mr-1.5" />
              Listanäkymä
            </Button>
          </Link>
        }
      />
      <div className="mb-4">
        <ProgressBar value={visitCount} max={TOTAL_PARKS} size="sm" />
      </div>
      <div className="h-[calc(100vh-250px)] min-h-[400px]">
        <ParkMap parks={NATIONAL_PARKS} visitedParkIds={visitedParkIds} />
      </div>
      <div className="flex gap-4 mt-3 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          Käyty
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          Käymättä
        </div>
      </div>
    </div>
  );
}
