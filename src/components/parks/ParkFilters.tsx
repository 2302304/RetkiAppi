'use client';

import { ParkFilters as ParkFiltersType } from '@/types/park';
import { Search } from 'lucide-react';

interface ParkFiltersProps {
  filters: ParkFiltersType;
  onChange: (filters: ParkFiltersType) => void;
  provinces: string[];
}

export function ParkFilters({ filters, onChange, provinces }: ParkFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Hae kansallispuistoa..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <select
        value={filters.province}
        onChange={(e) => onChange({ ...filters, province: e.target.value })}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
      >
        <option value="all">Kaikki maakunnat</option>
        {provinces.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as ParkFiltersType['status'] })}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
      >
        <option value="all">Kaikki</option>
        <option value="visited">Käydyt</option>
        <option value="unvisited">Käymättömät</option>
      </select>
      <select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split('-') as [ParkFiltersType['sortBy'], ParkFiltersType['sortOrder']];
          onChange({ ...filters, sortBy, sortOrder });
        }}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
      >
        <option value="name-asc">Nimi (A-Ö)</option>
        <option value="name-desc">Nimi (Ö-A)</option>
        <option value="area-desc">Pinta-ala (suurin)</option>
        <option value="area-asc">Pinta-ala (pienin)</option>
        <option value="established-asc">Perustusvuosi (vanhin)</option>
        <option value="established-desc">Perustusvuosi (uusin)</option>
      </select>
    </div>
  );
}
