'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Search, MapPin, Loader } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet en Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clicks en el mapa
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      
      // Reverse geocoding con Nominatim
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        onLocationSelect({
          lat,
          lng,
          direccion: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
      } catch (error) {
        console.error('Error al obtener dirección:', error);
        onLocationSelect({
          lat,
          lng,
          direccion: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
      }
    }
  });
  return null;
}

export default function MapaSelector({ onUbicacionSeleccionada, ubicacionInicial }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(
    ubicacionInicial || {
      lat: -34.6037,
      lng: -58.3816,
      direccion: ''
    }
  );
  const [mapCenter, setMapCenter] = useState([selectedLocation.lat, selectedLocation.lng]);
  const searchTimeoutRef = useRef(null);

  // Buscar direcciones con Nominatim
  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ar`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error al buscar dirección:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Debounce de búsqueda
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchResultClick = (result) => {
    const location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      direccion: result.display_name
    };
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    setSearchResults([]);
    setSearchQuery('');
    onUbicacionSeleccionada(location);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    onUbicacionSeleccionada(location);
  };

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar dirección..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
          />
          {searching && (
            <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={20} />
          )}
        </div>

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSearchResultClick(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-2"
              >
                <MapPin size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{result.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '300px', width: '100%' }}
          key={`${mapCenter[0]}-${mapCenter[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          {selectedLocation.lat && selectedLocation.lng && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
          )}
        </MapContainer>
      </div>

      {/* Instrucciones */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
        <p className="text-xs text-gray-600 flex items-start gap-2">
          <span className="text-base">💡</span>
          <span>
            Buscá tu dirección o hacé click en el mapa para seleccionar tu ubicación exacta
          </span>
        </p>
      </div>
    </div>
  );
}
