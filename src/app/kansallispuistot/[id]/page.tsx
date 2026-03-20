'use client';

import { use } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NATIONAL_PARKS } from '@/data/national-parks';
import { useParkVisits } from '@/hooks/useParkVisits';
import { VisitForm } from '@/components/parks/VisitForm';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  MapPin,
  Calendar,
  Ruler,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { formatDateLong } from '@/lib/utils';

export default function ParkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const park = NATIONAL_PARKS.find((p) => p.id === id);
  const { isVisited, getVisitForPark, addVisit, removeVisit } = useParkVisits();
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!park) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Kansallispuistoa ei löytynyt
        </h1>
        <Link href="/kansallispuistot" className="text-green-700 hover:underline">
          Takaisin listaan
        </Link>
      </div>
    );
  }

  const visited = isVisited(park.id);
  const visit = getVisitForPark(park.id);

  return (
    <div>
      <Link
        href="/kansallispuistot"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Takaisin
      </Link>

      <PageHeader
        title={park.name}
        action={
          <Badge variant={visited ? 'success' : 'default'} className="text-sm px-3 py-1">
            {visited ? 'Käyty' : 'Käymättä'}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">{park.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Sijainti</span>
                  <span className="font-medium flex items-center gap-1">
                    <MapPin size={14} /> {park.location}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Maakunta</span>
                  <span className="font-medium">{park.province}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Pinta-ala</span>
                  <span className="font-medium flex items-center gap-1">
                    <Ruler size={14} /> {park.area} km²
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Perustettu</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar size={14} /> {park.established}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardContent>
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-500" />
                Kohokohdat
              </h2>
              <div className="flex flex-wrap gap-2">
                {park.highlights.map((h) => (
                  <Badge key={h} variant="info">{h}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* External link */}
          <a
            href={park.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-green-700 hover:text-green-800 hover:underline"
          >
            <ExternalLink size={14} />
            Lisätietoja Luontoon.fi -sivustolla
          </a>
        </div>

        {/* Visit sidebar */}
        <div className="space-y-4">
          {visited && visit ? (
            <Card>
              <CardContent>
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  Käynti
                </h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Päivämäärä:</span>
                    <span className="ml-2 font-medium">
                      {formatDateLong(visit.visitDate)}
                    </span>
                  </div>
                  {visit.rating && (
                    <div>
                      <span className="text-gray-500 block mb-1">Arvosana:</span>
                      <StarRating value={visit.rating} readonly size={18} />
                    </div>
                  )}
                  {visit.notes && (
                    <div>
                      <span className="text-gray-500 block mb-1">Muistiinpanot:</span>
                      <p className="text-gray-700">{visit.notes}</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-4"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Poista käyntimerkintä
                </Button>
              </CardContent>
            </Card>
          ) : showVisitForm ? (
            <Card>
              <CardContent>
                <h2 className="font-semibold text-gray-900 mb-3">
                  Merkitse käydyksi
                </h2>
                <VisitForm
                  onSubmit={(date, notes, rating) => {
                    addVisit(park.id, date, notes, rating);
                    setShowVisitForm(false);
                  }}
                  onCancel={() => setShowVisitForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center">
                <p className="text-gray-500 text-sm mb-3">
                  Et ole vielä käynyt tässä puistossa.
                </p>
                <Button onClick={() => setShowVisitForm(true)}>
                  Merkitse käydyksi
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (visit) removeVisit(visit.id);
        }}
        title="Poista käyntimerkintä"
        message={`Haluatko varmasti poistaa käyntimerkinnän puistosta ${park.nameShort}?`}
      />
    </div>
  );
}
