'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Plane, MapPin, Loader2 } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  iataCode: string;
  type: string;
}

interface LocationAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (location: Location) => void;
  icon?: React.ReactNode;
}

export function LocationAutocomplete({ placeholder, value, onChange, icon }: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch locations from API
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/locations/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.success) {
          setResults(data.data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (location: Location) => {
    setQuery(`${location.city} (${location.iataCode})`);
    setIsOpen(false);
    onChange(location);
  };

  return (
    <div ref={wrapperRef} className="relative flex items-center gap-2 p-3 border rounded-lg">
      {icon || <Plane className="w-5 h-5 text-primary" />}
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
        className="border-0 p-0 focus-visible:ring-0"
      />
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
      
      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.map((location) => (
            <button
              key={location.id}
              onClick={() => handleSelect(location)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-start gap-3 border-b last:border-b-0"
            >
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">{location.city}</div>
                <div className="text-sm text-gray-600 truncate">{location.name}</div>
                <div className="text-xs text-gray-500">{location.iataCode} • {location.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

