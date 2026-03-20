'use client';

import { use } from 'react';
import { usePackingLists } from '@/hooks/usePackingLists';
import { PackingListEditor } from '@/components/planning/PackingListEditor';
import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PakkauslistaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getList, toggleItem, addItem, removeItem, uncheckAll } = usePackingLists();
  const list = getList(id);

  if (!list) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Pakkauslistaa ei löytynyt
        </h1>
        <Link href="/suunnittelu/pakkauslistat" className="text-green-700 hover:underline">
          Takaisin listoihin
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/suunnittelu/pakkauslistat"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Takaisin
      </Link>

      <PageHeader title={list.name} />

      <div className="max-w-2xl">
        <PackingListEditor
          list={list}
          onToggleItem={(itemId) => toggleItem(id, itemId)}
          onAddItem={(item) => addItem(id, item)}
          onRemoveItem={(itemId) => removeItem(id, itemId)}
          onUncheckAll={() => uncheckAll(id)}
        />
      </div>
    </div>
  );
}
