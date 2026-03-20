'use client';

import { useTripDiary } from '@/hooks/useTripDiary';
import { useStats } from '@/hooks/useStats';
import { StatsDashboard } from '@/components/diary/StatsDashboard';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';

export default function TilastotPage() {
  const { entries } = useTripDiary();
  const stats = useStats(entries);

  return (
    <div>
      <Link
        href="/paivakirja"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Takaisin päiväkirjaan
      </Link>

      <PageHeader title="Tilastot" description="Retkeilyn yhteenveto" />

      {entries.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Ei vielä dataa"
          description="Lisää retkimerkintöjä nähdäksesi tilastoja."
          action={
            <Link href="/paivakirja/uusi">
              <Button>
                <Plus size={16} className="mr-1.5" />
                Lisää merkintä
              </Button>
            </Link>
          }
        />
      ) : (
        <StatsDashboard stats={stats} />
      )}
    </div>
  );
}
