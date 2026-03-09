import { useEffect, useRef } from 'react';
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

// Custom icons
const createIcon = (color: string, type: 'stop' | 'vehicle') => {
  const size = type === 'vehicle' ? 30 : 24;
  const svg = type === 'vehicle'
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="${size}" height="${size}">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">${color === '#10b981' ? '🚌' : '🚃'}</text>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="${size}" height="${size}">
        <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/>
      </svg>`;
  
  return L.divIcon({
    html: `<div style="width: ${size}px; height: ${size}px;">${svg}</div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const busStopIcon = createIcon('#10b981', 'stop');
const trainStopIcon = createIcon('#f59e0b', 'stop');
const busVehicleIcon = createIcon('#10b981', 'vehicle');
const trainVehicleIcon = createIcon('#f59e0b', 'vehicle');

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

  const getRouteColor = (type: string) => {
    return type === 'bus' ? '#10b981' : '#f59e0b';
  };

  const routeStops = selectedRoute?.stops || [];
  const routeCoordinates = routeStops.map(
    (stop) => [stop.latitude, stop.longitude] as [number, number]
  );

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200">
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

        {/* Show all route paths when no route is selected */}
        {!selectedRoute && allRoutes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.stops.map((s) => [s.latitude, s.longitude] as [number, number])}
            color={getRouteColor(route.transport_type)}
            weight={2}
            opacity={0.3}
          />
        ))}

        {/* Selected route path */}
        {selectedRoute && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color={getRouteColor(selectedRoute.transport_type)}
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Route stops */}
        {routeStops.map((stop, index) => (
          <Marker
            key={`stop-${stop.stop_id}`}
            position={[stop.latitude, stop.longitude]}
            icon={selectedRoute?.transport_type === 'train' ? trainStopIcon : busStopIcon}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold">{stop.stop_name}</p>
                {stop.stop_tamil && (
                  <p className="text-sm text-gray-600">{stop.stop_tamil}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Stop {index + 1} of {routeStops.length}
                </p>
                {stop.distance > 0 && (
                  <p className="text-sm text-gray-500">
                    Distance: {stop.distance} km
                  </p>
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
            icon={vehicle.transport_type === 'bus' ? busVehicleIcon : trainVehicleIcon}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold flex items-center gap-2">
                  {vehicle.transport_type === 'bus' ? '🚌' : '🚃'}
                  {vehicle.vehicle_number}
                </p>
                <p className="text-sm text-gray-600">{vehicle.route_name}</p>
                <div className="mt-2 text-sm">
                  <p className="text-gray-500">
                    Current: <span className="font-medium">{vehicle.current_stop_name}</span>
                  </p>
                  {vehicle.next_stop_name && (
                    <p className="text-gray-500">
                      Next: <span className="font-medium">{vehicle.next_stop_name}</span>
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        vehicle.transport_type === 'bus' ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${vehicle.progress_percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {Math.round(vehicle.progress_percent)}% to next stop
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}