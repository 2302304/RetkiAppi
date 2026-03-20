'use client';

import { TripStats } from '@/types/diary';
import { Card, CardContent } from '@/components/ui/Card';
import { WEATHER_LABELS, DIFFICULTY_LABELS } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';
import { NATIONAL_PARKS } from '@/data/national-parks';
import { TrendingUp, Route, Clock, Star, Mountain } from 'lucide-react';

interface StatsDashboardProps {
  stats: TripStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const summaryCards = [
    {
      label: 'Retkiä yhteensä',
      value: stats.totalTrips,
      icon: TrendingUp,
    },
    {
      label: 'Kilometrejä yhteensä',
      value: `${stats.totalDistanceKm} km`,
      icon: Route,
    },
    {
      label: 'Aikaa luonnossa',
      value: formatDuration(stats.totalDurationMinutes),
      icon: Clock,
    },
    {
      label: 'Keskiarvo',
      value: `${stats.averageRating} / 5`,
      icon: Star,
    },
  ];

  // Get monthly trips for last 12 months
  const months: { key: string; label: string; count: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('fi-FI', { month: 'short' }).format(d);
    months.push({ key, label, count: stats.tripsPerMonth[key] || 0 });
  }
  const maxMonthly = Math.max(...months.map((m) => m.count), 1);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Icon size={20} className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{card.label}</p>
                    <p className="text-lg font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Monthly chart */}
      {stats.totalTrips > 0 && (
        <Card>
          <CardContent>
            <h3 className="font-semibold text-gray-900 mb-4">
              Retket kuukausittain (12 kk)
            </h3>
            <div className="flex items-end gap-1 h-32">
              {months.map((month) => (
                <div key={month.key} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{month.count || ''}</span>
                  <div
                    className="w-full bg-green-500 rounded-t transition-all"
                    style={{
                      height: `${(month.count / maxMonthly) * 100}%`,
                      minHeight: month.count > 0 ? '4px' : '0px',
                    }}
                  />
                  <span className="text-xs text-gray-400">{month.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Difficulty distribution */}
        {Object.keys(stats.difficultyDistribution).length > 0 && (
          <Card>
            <CardContent>
              <h3 className="font-semibold text-gray-900 mb-3">Vaikeustasot</h3>
              <div className="space-y-2">
                {Object.entries(stats.difficultyDistribution).map(
                  ([difficulty, count]) => (
                    <div key={difficulty} className="flex items-center gap-2 text-sm">
                      <span className="w-32 text-gray-600">
                        {DIFFICULTY_LABELS[difficulty] || difficulty}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-green-500 rounded-full h-2"
                          style={{
                            width: `${(count / stats.totalTrips) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Favorite parks */}
        {stats.favoriteParks.length > 0 && (
          <Card>
            <CardContent>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mountain size={18} className="text-green-600" />
                Eniten käydyt
              </h3>
              <div className="space-y-2">
                {stats.favoriteParks.map(({ parkId, count }) => {
                  const park = NATIONAL_PARKS.find((p) => p.id === parkId);
                  return (
                    <div key={parkId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        {park?.nameShort || parkId}
                      </span>
                      <span className="text-gray-500">
                        {count} {count === 1 ? 'retki' : 'retkeä'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weather distribution */}
        {Object.keys(stats.weatherDistribution).length > 0 && (
          <Card>
            <CardContent>
              <h3 className="font-semibold text-gray-900 mb-3">Sää retkillä</h3>
              <div className="space-y-2">
                {Object.entries(stats.weatherDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([weather, count]) => (
                    <div key={weather} className="flex items-center gap-2 text-sm">
                      <span className="w-32 text-gray-600">
                        {WEATHER_LABELS[weather] || weather}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-400 rounded-full h-2"
                          style={{
                            width: `${(count / stats.totalTrips) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
