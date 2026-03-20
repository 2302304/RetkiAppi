'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ParkCard } from '@/components/parks/ParkCard';
import { ParkFilters } from '@/components/parks/ParkFilters';
import { useParkVisits } from '@/hooks/useParkVisits';
import { NATIONAL_PARKS, PROVINCES, TOTAL_PARKS } from '@/data/national-parks';
import { ParkFilters as ParkFiltersType } from '@/types/park';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Map } from 'lucide-react';

export default function KansallispuistotPage() {
  const { visitCount, isVisited, getVisitForPark } = useParkVisits();
  const [filters, setFilters] = useState<ParkFiltersType>({
    search: '',
    province: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const filteredParks = useMemo(() => {
    let parks = [...NATIONAL_PARKS];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      parks = parks.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.nameShort.toLowerCase().includes(search) ||
          p.location.toLowerCase().includes(search)
      );
    }

    if (filters.province !== 'all') {
      parks = parks.filter((p) => p.province === filters.province);
    }

    if (filters.status === 'visited') {
      parks = parks.filter((p) => isVisited(p.id));
    } else if (filters.status === 'unvisited') {
      parks = parks.filter((p) => !isVisited(p.id));
    }

    parks.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.nameShort.localeCompare(b.nameShort, 'fi');
          break;
        case 'area':
          comparison = a.area - b.area;
          break;
        case 'established':
          comparison = a.established - b.established;
          break;
        case 'visitDate': {
          const visitA = getVisitForPark(a.id)?.visitDate || '';
          const visitB = getVisitForPark(b.id)?.visitDate || '';
          comparison = visitA.localeCompare(visitB);
          break;
        }
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return parks;
  }, [filters, isVisited, getVisitForPark]);

  return (
    <div>
      <PageHeader
        title="Kansallispuistot"
        description="Suomen kaikki 41 kansallispuistoa"
        action={
          <Link href="/kansallispuistot/kartta">
            <Button variant="secondary" size="sm">
              <Map size={16} className="mr-1.5" />
              Karttanäkymä
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <ProgressBar
          value={visitCount}
          max={TOTAL_PARKS}
          label="Edistyminen"
          size="lg"
        />
        {visitCount === TOTAL_PARKS && (
          <p className="text-green-700 font-medium mt-2">
            Onnittelut! Olet käynyt kaikissa Suomen kansallispuistoissa!
          </p>
        )}
      </div>

      <ParkFilters
        filters={filters}
        onChange={setFilters}
        provinces={PROVINCES}
      />

      <p className="text-sm text-gray-500 mb-3">
        {filteredParks.length} kansallispuistoa
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParks.map((park) => (
          <ParkCard
            key={park.id}
            park={park}
            isVisited={isVisited(park.id)}
            visitDate={getVisitForPark(park.id)?.visitDate}
          />
        ))}
      </div>
    </div>
  );
}
