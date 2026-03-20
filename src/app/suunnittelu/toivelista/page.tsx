'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { WishlistForm } from '@/components/planning/WishlistForm';
import { useWishlist } from '@/hooks/useWishlist';
import { SEASON_LABELS, PRIORITY_LABELS } from '@/lib/constants';
import { Plus, Heart, MapPin, Calendar, Trash2, Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ToivelistaPage() {
  const { destinations, addDestination, updateDestination, removeDestination } =
    useWishlist();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const editDest = editId
    ? destinations.find((d) => d.id === editId)
    : undefined;

  const sortedDests = [...destinations].sort((a, b) => {
    const priorityOrder = { korkea: 0, normaali: 1, matala: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

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
        title="Toivelista"
        description="Kohteet joissa haluat vielä käydä"
        action={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-1.5" />
            Lisää kohde
          </Button>
        }
      />

      {sortedDests.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Toivelista on tyhjä"
          description="Lisää kohteita joissa haluaisit käydä."
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus size={16} className="mr-1.5" />
              Lisää ensimmäinen kohde
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDests.map((dest) => (
            <Card key={dest.id} className="relative group">
              <CardContent>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{dest.name}</h3>
                  <Badge
                    variant={
                      dest.priority === 'korkea'
                        ? 'danger'
                        : dest.priority === 'normaali'
                        ? 'info'
                        : 'default'
                    }
                  >
                    {PRIORITY_LABELS[dest.priority]}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm text-gray-500">
                  {dest.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {dest.location}
                    </div>
                  )}
                  {dest.season && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {SEASON_LABELS[dest.season]}
                    </div>
                  )}
                  {dest.estimatedDuration && (
                    <p className="text-xs text-gray-400">
                      Kesto: {dest.estimatedDuration}
                    </p>
                  )}
                </div>

                {dest.notes && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {dest.notes}
                  </p>
                )}

                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditId(dest.id)}
                    className="p-1.5 text-gray-400 hover:text-green-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(dest.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add form */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Lisää kohde toivelistaan"
        className="max-w-xl"
      >
        <WishlistForm
          onSubmit={(data) => {
            addDestination(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Edit form */}
      <Modal
        isOpen={!!editId}
        onClose={() => setEditId(null)}
        title="Muokkaa kohdetta"
        className="max-w-xl"
      >
        {editDest && (
          <WishlistForm
            initialData={editDest}
            onSubmit={(data) => {
              updateDestination(editId!, data);
              setEditId(null);
            }}
            onCancel={() => setEditId(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) removeDestination(deleteId);
          setDeleteId(null);
        }}
        title="Poista kohde"
        message="Haluatko varmasti poistaa tämän kohteen toivelistalta?"
      />
    </div>
  );
}
