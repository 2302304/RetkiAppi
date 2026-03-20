'use client';

import { useMemo } from 'react';
import { TripEntry, TripStats } from '@/types/diary';

export function useStats(entries: TripEntry[]): TripStats {
  return useMemo(() => {
    const totalTrips = entries.length;

    const totalDistanceKm = entries.reduce(
      (sum, e) => sum + (e.distanceKm || 0),
      0
    );

    const totalDurationMinutes = entries.reduce(
      (sum, e) => sum + (e.durationMinutes || 0),
      0
    );

    const averageDistanceKm =
      totalTrips > 0
        ? Math.round((totalDistanceKm / totalTrips) * 10) / 10
        : 0;

    const averageRating =
      totalTrips > 0
        ? Math.round(
            (entries.reduce((sum, e) => sum + e.rating, 0) / totalTrips) * 10
          ) / 10
        : 0;

    const tripsPerMonth: Record<string, number> = {};
    const tripsPerYear: Record<string, number> = {};
    const parkCounts: Record<string, number> = {};
    const difficultyDistribution: Record<string, number> = {};
    const weatherDistribution: Record<string, number> = {};

    entries.forEach((entry) => {
      const monthKey = entry.date.substring(0, 7);
      tripsPerMonth[monthKey] = (tripsPerMonth[monthKey] || 0) + 1;

      const yearKey = entry.date.substring(0, 4);
      tripsPerYear[yearKey] = (tripsPerYear[yearKey] || 0) + 1;

      if (entry.parkId) {
        parkCounts[entry.parkId] = (parkCounts[entry.parkId] || 0) + 1;
      }

      if (entry.difficulty) {
        difficultyDistribution[entry.difficulty] =
          (difficultyDistribution[entry.difficulty] || 0) + 1;
      }

      if (entry.weather) {
        weatherDistribution[entry.weather] =
          (weatherDistribution[entry.weather] || 0) + 1;
      }
    });

    const favoriteParks = Object.entries(parkCounts)
      .map(([parkId, count]) => ({ parkId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const tripsWithDistance = entries.filter((e) => e.distanceKm && e.distanceKm > 0);
    const longestTrip =
      tripsWithDistance.length > 0
        ? tripsWithDistance.reduce((longest, e) =>
            (e.distanceKm || 0) > (longest.distanceKm || 0) ? e : longest
          )
        : null;

    return {
      totalTrips,
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      totalDurationMinutes,
      averageDistanceKm,
      averageRating,
      tripsPerMonth,
      tripsPerYear,
      favoriteParks,
      longestTrip,
      difficultyDistribution,
      weatherDistribution,
    };
  }, [entries]);
}
