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

// Custom icons for bus stops and vehicles
const createStopIcon = (isSelected: boolean) => {
  const size = 24;
  const color = isSelected ? '#10b981' : '#6b7280';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="${size}" height="${size}">
    <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>`;
  
  return L.divIcon({
    html: `<div style="width: ${size}px; height: ${size}px;">${svg}</div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const createVehicleIcon = () => {
  const size = 36;
  return L.divIcon({
    html: `<div style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; font-size: 24px; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));">🚌</div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const busStopIcon = createStopIcon(true);
const defaultStopIcon = createStopIcon(false);
const busVehicleIcon = createVehicleIcon();

// OSRM API to get actual road geometry
async function getRouteGeometry(coordinates: [number, number][]): Promise<[number, number][]> {
  if (coordinates.length < 2) return coordinates;
  
  try {
    // Format coordinates for OSRM: lng,lat;lng,lat;...
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
      // OSRM returns coordinates as [lng, lat], we need [lat, lng] for Leaflet
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
  // Tamil Nadu center coordinates
  const center: [number, number] = [10.8505, 78.6612];
  
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
    
    // Check cache first
    if (geometryCache.current.has(cacheKey)) {
      setRouteGeometry(geometryCache.current.get(cacheKey)!);
      return;
    }
    
    setIsLoadingRoute(true);
    
    const coordinates = stops.map(
      (stop) => [stop.latitude, stop.longitude] as [number, number]
    );
    
    const geometry = await getRouteGeometry(coordinates);
    
    // Cache the result
    geometryCache.current.set(cacheKey, geometry);
    setRouteGeometry(geometry);
    setIsLoadingRoute(false);
  }, []);

  useEffect(() => {
    fetchRouteGeometry(routeStops);
  }, [routeStops, fetchRouteGeometry]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 relative">
      {isLoadingRoute && (
        <div className="absolute top-2 right-2 z-[1000] bg-white px-3 py-1 rounded-full shadow-md text-sm text-gray-600 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading route...
        </div>
      )}
      
      <MapContainer
        center={center}
        zoom={7}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds when route changes */}
        <FitBounds stops={routeStops} />

        {/* Show all route paths when no route is selected (simplified, straight lines) */}
        {!selectedRoute && allRoutes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.stops.map((s) => [s.latitude, s.longitude] as [number, number])}
            color="#10b981"
            weight={2}
            opacity={0.3}
            dashArray="5, 10"
          />
        ))}

        {/* Selected route path - using actual road geometry from OSRM */}
        {selectedRoute && routeGeometry.length > 1 && (
          <Polyline
            positions={routeGeometry}
            color="#10b981"
            weight={5}
            opacity={0.8}
          />
        )}

        {/* Route stops */}
        {routeStops.map((stop, index) => (
          <Marker
            key={`stop-${stop.stop_id}`}
            position={[stop.latitude, stop.longitude]}
            icon={busStopIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🚏</span>
                  <p className="font-semibold text-gray-900">{stop.stop_name}</p>
                </div>
                {stop.stop_tamil && (
                  <p className="text-sm text-gray-600 mb-2">{stop.stop_tamil}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    Stop {index + 1} of {routeStops.length}
                  </span>
                </div>
                {stop.distance > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    📍 {stop.distance} km from start
                  </p>
                )}
                {stop.arrival_offset && (
                  <p className="text-sm text-gray-500">
                    ⏱️ ~{Math.floor(stop.arrival_offset / 60)}h {stop.arrival_offset % 60}m from start
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* All stops when no route selected */}
        {!selectedRoute && allRoutes.flatMap(route => route.stops).map((stop, index) => (
          <Marker
            key={`all-stop-${stop.stop_id}-${index}`}
            position={[stop.latitude, stop.longitude]}
            icon={defaultStopIcon}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold">{stop.stop_name}</p>
                {stop.stop_tamil && (
                  <p className="text-sm text-gray-600">{stop.stop_tamil}</p>
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
            icon={busVehicleIcon}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <p className="font-semibold flex items-center gap-2 text-gray-900">
                  🚌 {vehicle.vehicle_number}
                </p>
                <p className="text-sm text-gray-600 mt-1">{vehicle.route_name}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-gray-500">
                    📍 Current: <span className="font-medium text-gray-700">{vehicle.current_stop_name}</span>
                  </p>
                  {vehicle.next_stop_name && (
                    <p className="text-gray-500">
                      ➡️ Next: <span className="font-medium text-gray-700">{vehicle.next_stop_name}</span>
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(vehicle.progress_percent)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all duration-300"
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