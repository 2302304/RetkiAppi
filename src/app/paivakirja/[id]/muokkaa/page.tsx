'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useTripDiary } from '@/hooks/useTripDiary';
import { TripForm } from '@/components/diary/TripForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MuokkaaMerkintaaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getEntry, updateEntry } = useTripDiary();
  const entry = getEntry(id);

  if (!entry) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Merkintää ei löytynyt
        </h1>
        <Link href="/paivakirja" className="text-green-700 hover:underline">
          Takaisin päiväkirjaan
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/paivakirja/${id}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Takaisin
      </Link>

      <PageHeader title="Muokkaa merkintää" />

      <div className="max-w-2xl">
        <TripForm
          initialData={entry}
          onSubmit={(data) => {
            updateEntry(id, data);
            router.push(`/paivakirja/${id}`);
          }}
          onCancel={() => router.push(`/paivakirja/${id}`)}
          submitLabel="Tallenna muutokset"
        />
      </div>
    </div>
  );
}
