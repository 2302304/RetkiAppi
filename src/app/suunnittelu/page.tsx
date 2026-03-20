'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { usePackingLists } from '@/hooks/usePackingLists';
import { useWishlist } from '@/hooks/useWishlist';
import { ClipboardList, Heart, ChevronRight } from 'lucide-react';

export default function SuunnitteluPage() {
  const { lists } = usePackingLists();
  const { destinations } = useWishlist();

  return (
    <div>
      <PageHeader
        title="Suunnittelu"
        description="Pakkauslistat ja toivelista"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/suunnittelu/pakkauslistat">
          <Card hoverable className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <ClipboardList size={28} className="text-green-700" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">Pakkauslistat</h2>
                <p className="text-sm text-gray-500">
                  {lists.length === 0
                    ? 'Luo ensimmäinen pakkauslistasi'
                    : `${lists.length} ${lists.length === 1 ? 'lista' : 'listaa'}`}
                </p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/suunnittelu/toivelista">
          <Card hoverable className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <Heart size={28} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">Toivelista</h2>
                <p className="text-sm text-gray-500">
                  {destinations.length === 0
                    ? 'Lisää kohteita joihin haluat mennä'
                    : `${destinations.length} ${destinations.length === 1 ? 'kohde' : 'kohdetta'}`}
                </p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
