'use client';

import { useRouter } from 'next/navigation';
import { useTripDiary } from '@/hooks/useTripDiary';
import { TripForm } from '@/components/diary/TripForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UusiMerkintaPage() {
  const router = useRouter();
  const { addEntry } = useTripDiary();

  return (
    <div>
      <Link
        href="/paivakirja"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Takaisin
      </Link>

      <PageHeader title="Uusi retkimerkintä" />

      <div className="max-w-2xl">
        <TripForm
          onSubmit={(data) => {
            addEntry(data);
            router.push('/paivakirja');
          }}
          onCancel={() => router.push('/paivakirja')}
          submitLabel="Lisää merkintä"
        />
      </div>
    </div>
  );
}
