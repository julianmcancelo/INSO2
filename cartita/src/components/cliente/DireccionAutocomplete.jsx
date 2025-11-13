'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader } from 'lucide-react';

const DireccionAutocomplete = ({ value, onChange, placeholder, required }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Actualizar query cuando cambia el valor externo
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
    }
  }, [value, query]);

  const searchAddress = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const url = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery + ', Argentina')}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=5`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        return;
      }

      // Formatear resultados
      const formattedSuggestions = data.map(item => ({
        display_name: item.display_name,
        address: formatAddress(item.address || {}),
        lat: item.lat,
        lon: item.lon,
        raw: item
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error buscando dirección:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    const parts = [];
    
    if (address.road) parts.push(address.road);
    if (address.house_number) parts.push(address.house_number);
    if (address.suburb) parts.push(address.suburb);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    
    return parts.join(', ');
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);

    // Debounce para no hacer demasiadas peticiones
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchAddress(newValue);
    }, 500);
  };

  const handleSelectSuggestion = (suggestion) => {
    const selectedAddress = suggestion.address || suggestion.display_name;
    setQuery(selectedAddress);
    onChange(selectedAddress);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader size={18} className="text-gray-400 animate-spin" />
          ) : (
            <MapPin size={18} className="text-gray-400" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder || "Buscar dirección..."}
          required={required}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />

        {query && !loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Search size={18} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
            >
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.address}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {suggestion.display_name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {showSuggestions && !loading && query.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">
            No se encontraron direcciones. Intenta con otra búsqueda.
          </p>
        </div>
      )}

      {/* Ayuda */}
      {query.length < 3 && (
        <p className="mt-1 text-xs text-gray-500">
          💡 Escribe al menos 3 caracteres para buscar direcciones (o escribe manualmente)
        </p>
      )}
    </div>
  );
};

export default DireccionAutocomplete;
