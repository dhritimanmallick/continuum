/// <reference types="google.maps" />
/**
 * Nearby care on Google Maps: live Places search around the patient
 * (hospitals, maternity, gynaecologists, labs, pharmacies, or free text).
 * Requires a Maps JavaScript key with "Places API (New)" enabled.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search, MapPin, Star, Phone, Navigation, LocateFixed, AlertTriangle, Loader2 } from 'lucide-react';

const API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || 'AIzaSyCdtnfE8WuBtdO-2uTpdTI-kLmGaZOol8c';
const DEFAULT_CENTER = { lat: 15.3647, lng: 75.1240 }; // Hubballi, until the patient shares location

type Kind = { id: string; label: string; types?: string[]; text?: string };
const KINDS: Kind[] = [
  { id: 'hospital', label: 'Hospitals', types: ['hospital'] },
  { id: 'maternity', label: 'Maternity', text: 'maternity hospital' },
  { id: 'gynae', label: 'Gynaecologists', text: 'gynecologist obstetrician' },
  { id: 'lab', label: 'Labs', types: ['medical_lab'] },
  { id: 'pharmacy', label: 'Pharmacies', types: ['pharmacy'] },
];

interface Result {
  id: string;
  name: string;
  address: string;
  rating?: number;
  ratings?: number;
  phone?: string;
  mapsUrl?: string;
  type?: string;
  pos: google.maps.LatLngLiteral;
  km: number;
}

const kmBetween = (a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral) => {
  const R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(x)) * 10) / 10;
};

const FIELDS = ['id', 'displayName', 'formattedAddress', 'location', 'rating', 'userRatingCount', 'nationalPhoneNumber', 'googleMapsURI', 'primaryTypeDisplayName'];

const SearchLayer: React.FC<{
  center: google.maps.LatLngLiteral;
  kind: Kind | null;
  query: string;
  runId: number;
  onResults: (r: Result[]) => void;
  onError: (e: string | null) => void;
  onLoading: (b: boolean) => void;
}> = ({ center, kind, query, runId, onResults, onError, onLoading }) => {
  const placesLib = useMapsLibrary('places');
  const map = useMap();

  useEffect(() => {
    if (!placesLib || runId === 0) return;
    const { Place, SearchNearbyRankPreference } = placesLib as typeof google.maps.places;
    onLoading(true); onError(null);
    const text = query.trim() || kind?.text;
    const req = text
      ? Place.searchByText({ textQuery: text, fields: FIELDS, locationBias: { center, radius: 8000 }, maxResultCount: 15 })
      : Place.searchNearby({
          fields: FIELDS, includedPrimaryTypes: kind?.types || ['hospital'], maxResultCount: 15,
          locationRestriction: { center, radius: 8000 }, rankPreference: SearchNearbyRankPreference.DISTANCE,
        });
    req.then(({ places }) => {
      const res: Result[] = places.filter(p => p.location).map(p => {
        const pos = { lat: p.location!.lat(), lng: p.location!.lng() };
        return {
          id: p.id, name: p.displayName || 'Unnamed place', address: p.formattedAddress || '',
          rating: p.rating ?? undefined, ratings: p.userRatingCount ?? undefined,
          phone: p.nationalPhoneNumber ?? undefined, mapsUrl: p.googleMapsURI ?? undefined,
          type: p.primaryTypeDisplayName ?? undefined, pos, km: kmBetween(center, pos),
        };
      }).sort((a, b) => a.km - b.km);
      onResults(res);
      if (map && res.length) {
        const b = new google.maps.LatLngBounds(center);
        res.forEach(r => b.extend(r.pos));
        map.fitBounds(b, 60);
      }
    }).catch((e: unknown) => {
      onResults([]);
      onError(String((e as Error)?.message || e).includes('API') || String(e).includes('PERMISSION')
        ? 'Google Places search is not enabled for this API key. Enable "Places API (New)" for the key in Google Cloud Console.'
        : `Search failed: ${String((e as Error)?.message || e)}`);
    }).finally(() => onLoading(false));
  }, [placesLib, runId]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export const NearbyCareMap: React.FC = () => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [located, setLocated] = useState(false);
  const [kind, setKind] = useState<Kind | null>(KINDS[1]);
  const [query, setQuery] = useState('');
  const [runId, setRunId] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const run = useCallback(() => setRunId(n => n + 1), []);

  const locate = () => {
    if (!navigator.geolocation) return run();
    navigator.geolocation.getCurrentPosition(
      p => { setCenter({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocated(true); setRunId(n => n + 1); },
      () => run(),
      { timeout: 8000 }
    );
  };

  useEffect(() => { locate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="space-y-4 text-xs">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-slate-900">Nearby care</h2>
              <p className="text-slate-500">Live search on Google Maps {located ? 'around you' : 'around Hubballi (share your location for results near you)'}.</p>
            </div>
            <button onClick={locate} className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-800 font-bold hover:bg-rose-50 cursor-pointer">
              <LocateFixed className="w-3.5 h-3.5" /> Use my location
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <form onSubmit={e => { e.preventDefault(); setKind(null); run(); }} className="relative lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search e.g. ultrasound centre, NICU…"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-rose-400 focus:outline-none" />
            </form>
            <div className="flex flex-wrap gap-1.5 font-bold">
              {KINDS.map(k => (
                <button key={k.id} onClick={() => { setQuery(''); setKind(k); setRunId(n => n + 1); }}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${kind?.id === k.id && !query ? 'bg-rose-700 text-white' : 'bg-white text-slate-600 border border-rose-200 hover:bg-rose-50'}`}>
                  {k.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3 rounded-3xl overflow-hidden border border-slate-200 shadow-xs h-[420px] xl:h-[560px] bg-slate-100">
            <Map defaultCenter={DEFAULT_CENTER} defaultZoom={13} mapId="DEMO_MAP_ID" gestureHandling="greedy" disableDefaultUI={false}>
              <AdvancedMarker position={center} title="You">
                <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow" />
              </AdvancedMarker>
              {results.map(r => (
                <AdvancedMarker key={r.id} position={r.pos} title={r.name} onClick={() => setActive(r.id)}>
                  <Pin background={active === r.id ? '#be123c' : '#fb7185'} borderColor="#9f1239" glyphColor="#fff" />
                </AdvancedMarker>
              ))}
              <SearchLayer center={center} kind={kind} query={query} runId={runId} onResults={setResults} onError={setError} onLoading={setLoading} />
            </Map>
          </div>

          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col max-h-[560px]">
            <div className="px-4 py-3 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-between">
              <span>{loading ? 'Searching…' : `${results.length} place${results.length === 1 ? '' : 's'} found`}</span>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-rose-600" />}
            </div>
            <div className="overflow-y-auto divide-y divide-slate-100">
              {!loading && results.length === 0 && !error && <div className="p-6 text-center text-slate-500">Pick a category or search to see places near you.</div>}
              {results.map(r => (
                <div key={r.id} onMouseEnter={() => setActive(r.id)}
                  className={`p-4 space-y-1 transition ${active === r.id ? 'bg-rose-50/60' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-extrabold text-slate-900 text-sm leading-snug">{r.name}</span>
                    <span className="text-rose-700 font-black whitespace-nowrap">{r.km} km</span>
                  </div>
                  {r.type && <div className="text-[11px] text-slate-500">{r.type}</div>}
                  <div className="text-slate-600 flex items-start gap-1"><MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />{r.address}</div>
                  <div className="flex items-center gap-3 pt-1 flex-wrap">
                    {r.rating !== undefined && <span className="inline-flex items-center gap-1 text-slate-700"><Star className="w-3 h-3 text-amber-500 fill-amber-400" />{r.rating} ({r.ratings ?? 0})</span>}
                    {r.phone && <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 text-slate-700 hover:text-rose-700"><Phone className="w-3 h-3" />{r.phone}</a>}
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${r.pos.lat},${r.pos.lng}&destination_place_id=${r.id}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-rose-700 hover:underline"><Navigation className="w-3 h-3" />Directions</a>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 text-[10px] text-slate-400 border-t border-slate-100">Results from Google Maps.</div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};
