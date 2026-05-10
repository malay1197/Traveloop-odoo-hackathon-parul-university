import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary, Pin } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const CITIES = [
  { name: "Paris", country: "France", emoji: "🗼", cost: "$$$", pop: "Very popular", desc: "City of Light & romance", location: { lat: 48.8566, lng: 2.3522 } },
  { name: "Tokyo", country: "Japan", emoji: "🏙️", cost: "$$$$", pop: "Top destination", desc: "Ultramodern meets tradition", location: { lat: 35.6762, lng: 139.6503 } },
  { name: "Bali", country: "Indonesia", emoji: "🌺", cost: "$$", pop: "Trending", desc: "Tropical paradise & culture", location: { lat: -8.3405, lng: 115.092 } },
  { name: "New York", country: "USA", emoji: "🗽", cost: "$$$$", pop: "Iconic", desc: "The BIG Apple", location: { lat: 40.7128, lng: -74.006 } },
];

function MapMarkers({ places }: { places: any[] }) {
  return (
    <>
      {places.map((p, i) => (
        <AdvancedMarker key={i} position={p.location} title={p.name}>
          <Pin background="#c8b560" glyphColor="#fff" borderColor="#1a1500" />
        </AdvancedMarker>
      ))}
    </>
  );
}

function SearchHandler({ query, onResults }: { query: string, onResults: (results: any[]) => void }) {
  const placesLib = useMapsLibrary('places');
  const map = useMap();

  useEffect(() => {
    if (!placesLib || !query || query.length < 3) return;

    placesLib.Place.searchByText({
      textQuery: query,
      fields: ['displayName', 'location', 'formattedAddress'],
      locationBias: map?.getCenter() || { lat: 0, lng: 0 },
      maxResultCount: 5,
    }).then(({ places }: any) => {
      const mapped = (places || []).map((p: any) => ({
        name: p.displayName,
        location: p.location,
        address: p.formattedAddress
      }));
      onResults(mapped);
      if (mapped.length > 0 && map && mapped[0].location) {
        map.panTo(mapped[0].location);
        map.setZoom(10);
      }
    });
  }, [placesLib, query, map]);

  return null;
}

export const CitySearch: React.FC = () => {
  const [q, setQ] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const filtered = CITIES.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.country.toLowerCase().includes(q.toLowerCase()));

  if (!hasValidKey) {
    return (
      <div className="main-content fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: 520 }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>🗺️</div>
          <h2 className="page-title" style={{ marginBottom: 12 }}>Google Maps API Key Required</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 20 }}>To enable the interactive map, follow these steps:</p>
          <ul style={{ textAlign: 'left', lineHeight: '1.8', color: 'var(--text2)', marginBottom: 24, paddingLeft: 20 }}>
            <li>1. <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>Get an API Key</a></li>
            <li>2. Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
            <li>3. Select <strong>Secrets</strong></li>
            <li>4. Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> with your key</li>
          </ul>
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>The app will rebuild automatically after you add the secret.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content fade-up">
      <div className="page-header">
        <div className="page-title">City Search</div>
        <div className="page-subtitle">Discover and add cities using an interactive map</div>
      </div>

      <div className="search-layout" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>
              <Icon name="search" size={16} />
            </div>
            <input 
              className="form-input" 
              style={{ paddingLeft: 38 }} 
              placeholder="Search cities worldwide..." 
              value={q} 
              onChange={e => setQ(e.target.value)} 
            />
          </div>

          <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, overflowY: 'auto', maxHeight: '600px', paddingRight: 4 }}>
            {/* Display local mock cities first */}
            {filtered.map(city => (
              <div key={city.name} className="card" style={{ padding: 16, cursor: "pointer" }} onClick={() => setQ(city.name)}>
                <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontSize: 24 }}>{city.emoji}</div>
                  <span className="badge badge-gold" style={{ fontSize: 10 }}>{city.cost}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{city.name}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{city.country} · {city.desc}</div>
              </div>
            ))}
            
            {/* Display search results from API if any */}
            {searchResults.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', marginTop: 8 }}>Map Results</div>
                {searchResults.map((res, i) => (
                  <div key={i} className="card" style={{ padding: 12, borderLeft: '3px solid var(--gold)' }}>
                     <div style={{ fontWeight: 500, fontSize: 14 }}>{res.name}</div>
                     <div style={{ fontSize: 11, color: 'var(--text3)' }}>{res.address}</div>
                     <button className="btn btn-ghost btn-sm" style={{ marginTop: 6, fontSize: 11, padding: 0 }}>+ Add to trip</button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div style={{ height: '500px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={{ lat: 48.8566, lng: 2.3522 }}
              defaultZoom={4}
              mapId="TRAVEL_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              <MapMarkers places={searchResults.length > 0 ? searchResults : CITIES} />
              <SearchHandler query={q} onResults={setSearchResults} />
            </Map>
          </APIProvider>
        </div>
      </div>
    </div>
  );
};
