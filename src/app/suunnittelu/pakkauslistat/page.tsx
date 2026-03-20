'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { TemplateSelector } from '@/components/planning/TemplateSelector';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { usePackingLists } from '@/hooks/usePackingLists';
import { formatDate } from '@/lib/utils';
import { Plus, ClipboardList, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PakkauslistatPage() {
  const { lists, createFromTemplate, createEmpty, deleteList } = usePackingLists();
  const [showTemplate, setShowTemplate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div>
      <Link
        href="/suunnittelu"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Takaisin
      </Link>

      <PageHeader
        title="Pakkauslistat"
        description={`${lists.length} ${lists.length === 1 ? 'lista' : 'listaa'}`}
        action={
          <Button size="sm" onClick={() => setShowTemplate(true)}>
            <Plus size={16} className="mr-1.5" />
            Uusi lista
          </Button>
        }
      />

      {lists.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Ei vielä pakkauslistoja"
          description="Luo ensimmäinen pakkauslistasi valmiista pohjasta tai aloita tyhjästä."
          action={
            <Button onClick={() => setShowTemplate(true)}>
              <Plus size={16} className="mr-1.5" />
              Luo pakkauslista
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => {
            const checked = list.items.filter((i) => i.checked).length;
            const total = list.items.length;
            const progress = total > 0 ? Math.round((checked / total) * 100) : 0;

            return (
              <Card key={list.id} hoverable className="relative group">
                <Link href={`/suunnittelu/pakkauslistat/${list.id}`}>
                  <CardContent>
                    <h3 className="font-semibold text-gray-900 mb-1">{list.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={progress === 100 ? 'success' : 'default'}>
                        {checked}/{total} pakattu
                      </Badge>
                      {list.destination && (
                        <span className="text-xs text-gray-400">{list.destination}</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 rounded-full h-1.5 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Päivitetty {formatDate(list.updatedAt)}
                    </p>
                  </CardContent>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteId(list.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </Card>
            );
          })}
        </div>
      )}

      <TemplateSelector
        isOpen={showTemplate}
        onClose={() => setShowTemplate(false)}
        onSelect={(type, name) => createFromTemplate(type, name)}
        onCreateEmpty={(name) => createEmpty(name)}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteList(deleteId);
          setDeleteId(null);
        }}
        title="Poista pakkauslista"
        message="Haluatko varmasti poistaa tämän pakkauslistan?"
      />
    </div>
  );
}
