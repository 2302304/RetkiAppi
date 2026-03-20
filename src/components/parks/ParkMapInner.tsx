'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NationalPark } from '@/types/park';
import Link from 'next/link';

const visitedIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="24" height="32">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#16a34a"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
      <path d="M9 12l2 2 4-4" stroke="#16a34a" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>
  `),
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -32],
});

const unvisitedIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="24" height="32">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#9ca3af"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
    </svg>
  `),
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -32],
});

interface ParkMapInnerProps {
  parks: NationalPark[];
  visitedParkIds: Set<string>;
}

export default function ParkMapInner({ parks, visitedParkIds }: ParkMapInnerProps) {
  return (
    <MapContainer
      center={[64.5, 26.0]}
      zoom={5}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {parks.map((park) => {
        const visited = visitedParkIds.has(park.id);
        return (
          <Marker
            key={park.id}
            position={[park.coordinates.lat, park.coordinates.lng]}
            icon={visited ? visitedIcon : unvisitedIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{park.nameShort}</p>
                <p className="text-gray-500">{park.location}</p>
                <p className={visited ? 'text-green-600' : 'text-gray-400'}>
                  {visited ? 'Käyty' : 'Käymättä'}
                </p>
                <Link
                  href={`/kansallispuistot/${park.id}`}
                  className="text-green-700 hover:underline text-xs"
                >
                  Näytä tiedot →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
