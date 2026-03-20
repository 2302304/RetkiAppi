'use client';

import { useTripDiary } from '@/hooks/useTripDiary';
import { PageHeader } from '@/components/layout/PageHeader';
import { TripCard } from '@/components/diary/TripCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';
import { Plus, BookOpen, BarChart3 } from 'lucide-react';

export default function PaivakirjaPage() {
  const { entriesByDate } = useTripDiary();

  return (
    <div>
      <PageHeader
        title="Retkipäiväkirja"
        description={`${entriesByDate.length} merkintää`}
        action={
          <div className="flex gap-2">
            <Link href="/paivakirja/tilastot">
              <Button variant="secondary" size="sm">
                <BarChart3 size={16} className="mr-1.5" />
                Tilastot
              </Button>
            </Link>
            <Link href="/paivakirja/uusi">
              <Button size="sm">
                <Plus size={16} className="mr-1.5" />
                Uusi merkintä
              </Button>
            </Link>
          </div>
        }
      />

      {entriesByDate.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Ei vielä retkimerkintöjä"
          description="Lisää ensimmäinen retkimerkintäsi ja aloita retkipäiväkirjan pitäminen."
          action={
            <Link href="/paivakirja/uusi">
              <Button>
                <Plus size={16} className="mr-1.5" />
                Lisää ensimmäinen merkintä
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {entriesByDate.map((entry) => (
            <TripCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
