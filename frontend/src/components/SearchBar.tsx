import { useState, useEffect, useRef } from 'react';
import { Stop } from '../types';
import { stopsApi } from '../services/api';

// Extended Stop type to include source
interface StopWithSource extends Stop {
  source?: 'db' | 'osm';
}

interface StopInputProps {
  label: string;
  placeholder: string;
  value: StopWithSource | null;
  onChange: (stop: StopWithSource | null) => void;
  icon: React.ReactNode;
}

function StopInput({ label, placeholder, value, onChange, icon }: StopInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<StopWithSource[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(value.name);
    }
  }, [value]);

  useEffect(() => {
    const searchStops = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await stopsApi.search(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching stops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchStops, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (stop: StopWithSource) => {
    onChange(stop);
    setQuery(stop.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1 min-w-[200px]">
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (value && e.target.value !== value.name) {
              onChange(null);
            }
          }}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
        />
        {isLoading && (
          <span className="absolute right-10 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="autocomplete-dropdown absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl shadow-gray-950/50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((stop) => (
            <button
              key={stop.id}
              onClick={() => handleSelect(stop)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700/50 flex items-center gap-3 border-b border-gray-700/50 last:border-0 transition-colors"
            >
              <span className="text-lg">🚏</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white truncate">{stop.name}</p>
                  {stop.source === 'osm' && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full flex-shrink-0 border border-blue-500/30">
                      OSM
                    </span>
                  )}
                  {stop.source === 'db' && (
                    <span className="text-xs px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full flex-shrink-0 border border-cyan-500/30">
                      BMTC
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{stop.district || 'Bangalore'}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface SearchBarProps {
  onSearch: (from: Stop, to: Stop, stops: Stop[]) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [fromStop, setFromStop] = useState<StopWithSource | null>(null);
  const [toStop, setToStop] = useState<StopWithSource | null>(null);
  const [intermediateStops, setIntermediateStops] = useState<(StopWithSource | null)[]>([]);

  const handleAddStop = () => {
    setIntermediateStops([...intermediateStops, null]);
  };

  const handleRemoveStop = (index: number) => {
    setIntermediateStops(intermediateStops.filter((_, i) => i !== index));
  };

  const handleIntermediateChange = (index: number, stop: StopWithSource | null) => {
    const newStops = [...intermediateStops];
    newStops[index] = stop;
    setIntermediateStops(newStops);
  };

  const handleSearch = () => {
    if (fromStop && toStop) {
      const validStops = intermediateStops.filter((s): s is Stop => s !== null);
      onSearch(fromStop, toStop, validStops);
    }
  };

  const canSearch = fromStop && toStop;

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-800">
      <div className="flex flex-wrap gap-4 items-end">
        <StopInput
          label="From"
          placeholder="e.g., Majestic, Koramangala..."
          value={fromStop}
          onChange={setFromStop}
          icon={
            <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="3" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="M12 2v4m0 12v4M2 12h4m12 0h4" />
            </svg>
          }
        />

        {intermediateStops.map((stop, index) => (
          <div key={index} className="relative flex-1 min-w-[200px]">
            <StopInput
              label={`Via Stop ${index + 1}`}
              placeholder="Add stop..."
              value={stop}
              onChange={(s) => handleIntermediateChange(index, s)}
              icon={
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <button
              onClick={() => handleRemoveStop(index)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-400 transition-colors shadow-lg"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        <StopInput
          label="To"
          placeholder="e.g., Electronic City, Whitefield..."
          value={toStop}
          onChange={setToStop}
          icon={
            <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        <div className="flex gap-2">
          <button
            onClick={handleAddStop}
            className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 border border-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Stop</span>
          </button>

          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
              canSearch
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Routes
          </button>
        </div>
      </div>
      
      {/* Helper text */}
      <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
          BMTC stops (with bus routes)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          OSM stops (from OpenStreetMap)
        </span>
      </div>
    </div>
  );
}