'use client';

import Link from 'next/link';
import { useParkVisits } from '@/hooks/useParkVisits';
import { useTripDiary } from '@/hooks/useTripDiary';
import { useStats } from '@/hooks/useStats';
import { TOTAL_PARKS } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TripCard } from '@/components/diary/TripCard';
import { Button } from '@/components/ui/Button';
import {
  Mountain,
  Route,
  Clock,
  Star,
  Plus,
  Map,
  BookOpen,
  ChevronRight,
  Heart,
  ClipboardList,
} from 'lucide-react';

export default function EtusivuPage() {
  const { visitCount } = useParkVisits();
  const { entries, entriesByDate } = useTripDiary();
  const stats = useStats(entries);
  const recentTrips = entriesByDate.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Tervetuloa retkeilemään!
        </h1>
        <p className="text-gray-500">
          Seuraa retkiäsi ja kansallispuistokäyntejäsi.
        </p>
      </div>

      {/* Kansallispuistot progress */}
      <Link href="/kansallispuistot">
        <Card hoverable>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Mountain size={24} className="text-green-700" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  Kansallispuistot
                </h2>
                <p className="text-sm text-gray-500">
                  {visitCount} / {TOTAL_PARKS} käyty
                </p>
              </div>
            </div>
            <ProgressBar
              value={visitCount}
              max={TOTAL_PARKS}
              showPercentage={false}
              size="md"
            />
            {visitCount === TOTAL_PARKS ? (
              <p className="text-green-700 font-medium text-sm mt-2">
                Kaikki puistot käyty!
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-2">
                {TOTAL_PARKS - visitCount} puistoa jäljellä
              </p>
            )}
          </CardContent>
        </Card>
      </Link>

      {/* Quick stats */}
      {stats.totalTrips > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="flex items-center gap-3">
              <BookOpen size={20} className="text-green-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Retkiä</p>
                <p className="text-lg font-bold">{stats.totalTrips}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3">
              <Route size={20} className="text-blue-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Kilometrejä</p>
                <p className="text-lg font-bold">{stats.totalDistanceKm}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3">
              <Clock size={20} className="text-purple-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Luonnossa</p>
                <p className="text-lg font-bold">
                  {formatDuration(stats.totalDurationMinutes)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3">
              <Star size={20} className="text-yellow-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Keskiarvo</p>
                <p className="text-lg font-bold">{stats.averageRating} / 5</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent trips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Viimeisimmät retket
          </h2>
          <Link
            href="/paivakirja"
            className="text-sm text-green-700 hover:underline flex items-center gap-1"
          >
            Kaikki <ChevronRight size={14} />
          </Link>
        </div>
        {recentTrips.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 text-sm mb-3">
                Ei vielä retkimerkintöjä.
              </p>
              <Link href="/paivakirja/uusi">
                <Button size="sm">
                  <Plus size={16} className="mr-1.5" />
                  Lisää ensimmäinen
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentTrips.map((entry) => (
              <TripCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/paivakirja/uusi">
          <Card hoverable>
            <CardContent className="text-center py-4">
              <Plus size={24} className="mx-auto text-green-600 mb-1" />
              <span className="text-sm font-medium text-gray-700">Uusi merkintä</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/kansallispuistot/kartta">
          <Card hoverable>
            <CardContent className="text-center py-4">
              <Map size={24} className="mx-auto text-blue-600 mb-1" />
              <span className="text-sm font-medium text-gray-700">Karttanäkymä</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/suunnittelu/pakkauslistat">
          <Card hoverable>
            <CardContent className="text-center py-4">
              <ClipboardList size={24} className="mx-auto text-orange-600 mb-1" />
              <span className="text-sm font-medium text-gray-700">Pakkauslistat</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/suunnittelu/toivelista">
          <Card hoverable>
            <CardContent className="text-center py-4">
              <Heart size={24} className="mx-auto text-red-500 mb-1" />
              <span className="text-sm font-medium text-gray-700">Toivelista</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
