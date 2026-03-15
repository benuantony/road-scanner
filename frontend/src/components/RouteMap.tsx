import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Route, Vehicle, RouteStop } from '../types';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for bus stops - Blue/Purple themed based on transport type
const createStopIcon = (isSelected: boolean, index?: number, total?: number, transportType: string = 'bus') => {
  const size = isSelected ? 28 : 20;
  const isTerminal = index === 0 || index === (total ? total - 1 : 0);
  const isMetro = transportType === 'metro';
  
  // Colors based on transport type
  const primaryColor = isSelected 
    ? (isMetro ? '#7c3aed' : '#1e40af') // Purple for metro, Blue for bus
    : '#6b7280';
  const innerColor = isTerminal && isSelected 
    ? '#dc2626' // Red for terminals
    : (isSelected ? (isMetro ? '#8b5cf6' : '#2563eb') : '#9ca3af');
  
  const fillColor = isSelected 
    ? (isMetro ? 'rgba(139, 92, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)')
    : 'rgba(107, 114, 128, 0.3)';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
    <circle cx="12" cy="12" r="10" fill="${fillColor}"/>
    <circle cx="12" cy="12" r="7" fill="white" stroke="${primaryColor}" stroke-width="2"/>
    <circle cx="12" cy="12" r="3" fill="${innerColor}"/>
  </svg>`;
  
  return L.divIcon({
    html: `<div style="width: ${size}px; height: ${size}px;">${svg}</div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const createVehicleIcon = (transportType: string = 'bus') => {
  const size = 44;
  const isMetro = transportType === 'metro';
  const emoji = isMetro ? '🚇' : '🚌';
  const glowColor = isMetro ? 'rgba(139, 92, 246, 0.4)' : 'rgba(37, 99, 235, 0.4)';
  
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        position: relative;
      ">
        <div style="
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, ${glowColor} 0%, transparent 70%);
          animation: pulse-glow 2s infinite;
          border-radius: 50%;
        "></div>
        <div style="
          font-size: 28px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          z-index: 1;
        ">${emoji}</div>
      </div>
    `,
    className: 'custom-marker vehicle-marker-glow',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// OSRM API to get actual road geometry
async function getRouteGeometry(coordinates: [number, number][]): Promise<[number, number][]> {
  if (coordinates.length < 2) return coordinates;
  
  try {
    const coordString = coordinates
      .map(([lat, lng]) => `${lng},${lat}`)
      .join(';');
    
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
    );
    
    if (!response.ok) {
      console.warn('OSRM API request failed, using straight lines');
      return coordinates;
    }
    
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes[0]) {
      const geometry = data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
      );
      return geometry;
    }
    
    return coordinates;
  } catch (error) {
    console.warn('Error fetching route geometry:', error);
    return coordinates;
  }
}

// Component to fit map bounds when route changes
function FitBounds({ stops }: { stops: RouteStop[] }) {
  const map = useMap();
  const prevStopsRef = useRef<RouteStop[]>([]);

  useEffect(() => {
    if (stops.length > 0 && JSON.stringify(stops) !== JSON.stringify(prevStopsRef.current)) {
      const bounds = L.latLngBounds(
        stops.map((stop) => [stop.latitude, stop.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
      prevStopsRef.current = stops;
    }
  }, [stops, map]);

  return null;
}

interface RouteMapProps {
  selectedRoute: Route | null;
  vehicles: Vehicle[];
  allRoutes?: Route[];
}

export default function RouteMap({ selectedRoute, vehicles, allRoutes = [] }: RouteMapProps) {
  // Bangalore center coordinates
  const center: [number, number] = [12.9716, 77.5946];
  
  // State for road-snapped route geometry
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  
  // Cache for route geometries
  const geometryCache = useRef<Map<string, [number, number][]>>(new Map());

  const routeStops = selectedRoute?.stops || [];
  
  // Fetch road geometry when route changes
  const fetchRouteGeometry = useCallback(async (stops: RouteStop[]) => {
    if (stops.length < 2) {
      setRouteGeometry([]);
      return;
    }
    
    const cacheKey = stops.map(s => `${s.latitude},${s.longitude}`).join('|');
    
    if (geometryCache.current.has(cacheKey)) {
      setRouteGeometry(geometryCache.current.get(cacheKey)!);
      return;
    }
    
    setIsLoadingRoute(true);
    
    const coordinates = stops.map(
      (stop) => [stop.latitude, stop.longitude] as [number, number]
    );
    
    const geometry = await getRouteGeometry(coordinates);
    
    geometryCache.current.set(cacheKey, geometry);
    setRouteGeometry(geometry);
    setIsLoadingRoute(false);
  }, []);

  useEffect(() => {
    fetchRouteGeometry(routeStops);
  }, [routeStops, fetchRouteGeometry]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-gray-300 relative bg-white shadow-lg">
      {isLoadingRoute && (
        <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-blue-200 text-sm text-blue-600 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading route...</span>
        </div>
      )}
      
      <MapContainer
        center={center}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        {/* Light Blue Map Tiles - CartoDB Positron (Light Theme) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Fit bounds when route changes */}
        <FitBounds stops={routeStops} />

        {/* Show all route paths when no route is selected (simplified, straight lines) */}
        {!selectedRoute && allRoutes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.stops.map((s) => [s.latitude, s.longitude] as [number, number])}
            color="#3b82f6"
            weight={2}
            opacity={0.3}
            dashArray="5, 10"
          />
        ))}

        {/* Selected route path - Blue for bus, Purple for metro */}
        {selectedRoute && routeGeometry.length > 1 && (() => {
          const isMetro = selectedRoute.transport_type === 'metro';
          const colors = isMetro 
            ? { shadow: '#5b21b6', outer: '#7c3aed', core: '#6d28d9' }
            : { shadow: '#1e3a8a', outer: '#1e40af', core: '#1e3a8a' };
          
          return (
            <>
              {/* Shadow/glow layer */}
              <Polyline
                positions={routeGeometry}
                color={colors.shadow}
                weight={12}
                opacity={0.2}
                lineCap="round"
                lineJoin="round"
              />
              {/* Outer layer */}
              <Polyline
                positions={routeGeometry}
                color={colors.outer}
                weight={8}
                opacity={0.5}
                lineCap="round"
                lineJoin="round"
              />
              {/* Core line */}
              <Polyline
                positions={routeGeometry}
                color={colors.core}
                weight={5}
                opacity={1}
                lineCap="round"
                lineJoin="round"
              />
            </>
          );
        })()}

        {/* Route stops */}
        {routeStops.map((stop, index) => (
          <Marker
            key={`stop-${stop.stop_id}`}
            position={[stop.latitude, stop.longitude]}
            icon={createStopIcon(true, index, routeStops.length, selectedRoute?.transport_type)}
          >
            <Popup>
              <div className="p-3 min-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🚏</span>
                  <p className="font-semibold text-blue-800">{stop.stop_name}</p>
                </div>
                {stop.stop_tamil && (
                  <p className="text-sm text-gray-500 mb-2">{stop.stop_tamil}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Stop {index + 1} of {routeStops.length}
                  </span>
                </div>
                {stop.distance > 0 && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <span className="text-blue-500">📍</span> {stop.distance} km from start
                  </p>
                )}
                {stop.arrival_offset !== undefined && stop.arrival_offset > 0 && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="text-orange-500">⏱️</span> ETA: ~{Math.floor(stop.arrival_offset / 60) > 0 ? `${Math.floor(stop.arrival_offset / 60)}h ` : ''}{stop.arrival_offset % 60}min
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* All stops when no route selected */}
        {!selectedRoute && allRoutes.flatMap(route => route.stops).filter((stop, index, self) => 
          self.findIndex(s => s.stop_id === stop.stop_id) === index
        ).map((stop, index) => (
          <Marker
            key={`all-stop-${stop.stop_id}-${index}`}
            position={[stop.latitude, stop.longitude]}
            icon={createStopIcon(false)}
          >
            <Popup>
              <div className="p-3">
                <p className="font-semibold text-blue-800">{stop.stop_name}</p>
                {stop.stop_tamil && (
                  <p className="text-sm text-gray-500">{stop.stop_tamil}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Vehicle markers */}
        {vehicles.map((vehicle) => (
          <Marker
            key={`vehicle-${vehicle.id}`}
            position={[vehicle.current_latitude, vehicle.current_longitude]}
            icon={createVehicleIcon(vehicle.transport_type || selectedRoute?.transport_type || 'bus')}
          >
            <Popup>
              <div className="p-3 min-w-[240px]">
                <p className="font-semibold flex items-center gap-2 text-blue-800">
                  🚌 {vehicle.vehicle_number}
                </p>
                <p className="text-sm text-gray-500 mt-1">{vehicle.route_name}</p>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="text-blue-500">📍</span> Current: <span className="font-medium">{vehicle.current_stop_name}</span>
                  </p>
                  {vehicle.next_stop_name && (
                    <p className="text-gray-600">
                      <span className="text-orange-500">➡️</span> Next: <span className="font-medium">{vehicle.next_stop_name}</span>
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span className="text-blue-600">{Math.round(vehicle.progress_percent)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                      style={{ width: `${vehicle.progress_percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}