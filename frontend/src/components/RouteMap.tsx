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

// Get emoji and color based on transport type and operator
const getVehicleEmoji = (transportType: string = 'bus', operator?: string) => {
  if (transportType === 'metro') {
    return { emoji: '🚇', color: 'rgba(139, 92, 246, 0.4)' }; // Purple for metro
  }
  if (operator?.includes('Volvo')) {
    return { emoji: '🚎', color: 'rgba(37, 99, 235, 0.4)' }; // Blue for Volvo AC
  }
  if (operator?.includes('Vajra')) {
    return { emoji: '🚐', color: 'rgba(249, 115, 22, 0.4)' }; // Orange for Vajra
  }
  return { emoji: '🚌', color: 'rgba(34, 197, 94, 0.4)' }; // Green for regular
};

const createVehicleIcon = (transportType: string = 'bus', operator?: string) => {
  const size = 44;
  const { emoji, color: glowColor } = getVehicleEmoji(transportType, operator);
  
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

// Component to focus map on a specific stop
function FocusOnStop({ stop }: { stop: { latitude: number; longitude: number } | null }) {
  const map = useMap();
  const prevStopRef = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (stop && (stop.latitude !== prevStopRef.current?.latitude || stop.longitude !== prevStopRef.current?.longitude)) {
      map.flyTo([stop.latitude, stop.longitude], 16, { duration: 0.5 });
      prevStopRef.current = stop;
    }
  }, [stop, map]);

  return null;
}

interface RouteMapProps {
  selectedRoute: Route | null;
  vehicles: Vehicle[];
  allRoutes?: Route[];
  focusedStop?: { latitude: number; longitude: number } | null;
  currentStopIndex?: number;
  onBusClick?: () => void;
}

export default function RouteMap({ selectedRoute, vehicles, allRoutes = [], focusedStop = null, currentStopIndex = 0, onBusClick }: RouteMapProps) {
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

        {/* Focus on selected stop */}
        <FocusOnStop stop={focusedStop} />

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

        {/* Route stops - All stops on the selected route */}
        {routeStops.map((stop, index) => {
          const isMetro = selectedRoute?.transport_type === 'metro';
          const isFirst = index === 0;
          const isLast = index === routeStops.length - 1;
          const isCurrent = index === currentStopIndex;
          const isPassed = index < currentStopIndex;
          
          // Calculate ETA from current position
          const currentArrivalOffset = routeStops[currentStopIndex]?.arrival_offset || 0;
          const stopArrivalOffset = stop.arrival_offset || 0;
          const etaFromCurrent = stopArrivalOffset - currentArrivalOffset;
          
          // Predicted arrival time
          const now = new Date();
          const predictedTime = new Date(now.getTime() + Math.max(0, etaFromCurrent) * 60000);
          const predictedTimeStr = predictedTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          
          return (
            <Marker
              key={`stop-${stop.stop_id}-${index}`}
              position={[stop.latitude, stop.longitude]}
              icon={createStopIcon(true, index, routeStops.length, selectedRoute?.transport_type)}
            >
              <Popup>
                <div className="min-w-[260px] bg-white rounded-lg shadow-lg overflow-hidden" style={{ margin: '-14px -20px' }}>
                  {/* Header */}
                  <div className={`px-4 py-3 ${
                    isFirst ? 'bg-green-600' : 
                    isLast ? 'bg-red-600' : 
                    isCurrent ? 'bg-orange-500' :
                    isPassed ? 'bg-gray-500' :
                    (isMetro ? 'bg-purple-600' : 'bg-blue-600')
                  } text-white`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚏</span>
                      <div className="flex-1">
                        <p className="font-bold">{stop.stop_name}</p>
                        {stop.stop_tamil && (
                          <p className="text-xs text-white/80">{stop.stop_tamil}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      isFirst ? 'bg-green-100 text-green-700' :
                      isLast ? 'bg-red-100 text-red-700' :
                      isCurrent ? 'bg-orange-100 text-orange-700' :
                      isPassed ? 'bg-gray-100 text-gray-600' :
                      (isMetro ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')
                    }`}>
                      {isFirst ? '🚩 Start' : 
                       isLast ? '🏁 End' : 
                       isCurrent ? '📍 Current' :
                       isPassed ? '✓ Passed' : '○ Upcoming'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stop {index + 1} of {routeStops.length}
                    </span>
                  </div>
                  
                  {/* Details */}
                  <div className="px-4 py-3 space-y-2">
                    {stop.distance > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Distance from start</span>
                        <span className="font-medium text-gray-700">{stop.distance.toFixed(1)} km</span>
                      </div>
                    )}
                    
                    {!isPassed && etaFromCurrent > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">ETA from current</span>
                        <span className={`font-bold ${isMetro ? 'text-purple-600' : 'text-blue-600'}`}>
                          ~{etaFromCurrent} min
                        </span>
                      </div>
                    )}
                    
                    {!isPassed && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Predicted arrival</span>
                        <span className="font-medium text-gray-700">{predictedTimeStr}</span>
                      </div>
                    )}
                    
                    {isPassed && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span>✓</span>
                        <span>Bus has already passed this stop</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${isMetro ? 'bg-purple-500' : 'bg-blue-500'}`}
                          style={{ width: `${((index + 1) / routeStops.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(((index + 1) / routeStops.length) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

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

        {/* Current bus position marker - shows bus at the current stop (orange dot in timeline) */}
        {selectedRoute && routeStops.length > 0 && currentStopIndex < routeStops.length && (() => {
          const isMetro = selectedRoute.transport_type === 'metro';
          const isVolvo = selectedRoute.operator?.includes('Volvo');
          const isVajra = selectedRoute.operator?.includes('Vajra');
          const stopsCompleted = currentStopIndex;
          const stopsRemaining = routeStops.length - 1 - currentStopIndex;
          const progressPercent = routeStops.length > 1 ? Math.round((currentStopIndex / (routeStops.length - 1)) * 100) : 0;

          // Get icon and colors based on type
          const { emoji } = getVehicleEmoji(selectedRoute.transport_type || 'bus', selectedRoute.operator);
          const headerBgColor = isMetro ? 'bg-purple-600' : isVolvo ? 'bg-blue-600' : isVajra ? 'bg-orange-500' : 'bg-green-600';
          const accentColor = isMetro ? 'text-purple-600' : isVolvo ? 'text-blue-600' : isVajra ? 'text-orange-600' : 'text-green-600';
          const progressBgColor = isMetro 
            ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
            : isVolvo 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
              : isVajra
                ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                : 'bg-gradient-to-r from-green-500 to-green-600';

          // Calculate ETA to destination
          const currentArrivalOffset = routeStops[currentStopIndex]?.arrival_offset || 0;
          const finalArrivalOffset = routeStops[routeStops.length - 1]?.arrival_offset || 0;
          const etaToDestination = finalArrivalOffset - currentArrivalOffset;

          // Calculate predicted arrival time
          const now = new Date();
          const predictedArrival = new Date(now.getTime() + etaToDestination * 60000);
          const predictedArrivalStr = predictedArrival.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

          // Calculate next stop ETA
          const nextStopOffset = currentStopIndex < routeStops.length - 1
            ? (routeStops[currentStopIndex + 1]?.arrival_offset || 0) - currentArrivalOffset
            : 0;

          return (
            <Marker
              key="current-bus-position"
              position={[routeStops[currentStopIndex].latitude, routeStops[currentStopIndex].longitude]}
              icon={createVehicleIcon(selectedRoute.transport_type || 'bus', selectedRoute.operator)}
              eventHandlers={{
                click: () => {
                  if (onBusClick) onBusClick();
                }
              }}
            >
              <Popup>
                <div className="min-w-[280px] bg-white rounded-lg shadow-lg overflow-hidden" style={{ margin: '-14px -20px' }}>
                  {/* Header */}
                  <div className={`px-4 py-3 ${headerBgColor} text-white`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <p className="font-bold">{selectedRoute.route_number}</p>
                        <p className="text-xs text-white/80">{selectedRoute.route_name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Location */}
                  <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-orange-600 font-medium uppercase">Current Location</span>
                    </div>
                    <p className="font-semibold text-gray-800 mt-1">{routeStops[currentStopIndex].stop_name}</p>
                  </div>

                  {/* Next Stop */}
                  {currentStopIndex < routeStops.length - 1 && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${isMetro ? 'bg-purple-400' : isVolvo ? 'bg-blue-400' : isVajra ? 'bg-orange-400' : 'bg-green-400'} rounded-full`}></div>
                        <span className="text-xs text-gray-500 font-medium uppercase">Next Stop</span>
                        {nextStopOffset > 0 && (
                          <span className={`ml-auto text-xs font-bold ${accentColor}`}>
                            ~{nextStopOffset} min
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-700 mt-1">{routeStops[currentStopIndex + 1].stop_name}</p>
                    </div>
                  )}

                  {/* Progress Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">Route Progress</span>
                      <span className={`font-bold ${accentColor}`}>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${progressBgColor}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Stop indicators */}
                    <div className="flex justify-between mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-600">{stopsCompleted} stops completed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">○</span>
                        <span className="text-gray-600">{stopsRemaining} stops remaining</span>
                      </div>
                    </div>
                  </div>

                  {/* ETA Section */}
                  <div className="px-4 py-3 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">ETA to Destination</p>
                        <p className={`text-lg font-bold ${accentColor}`}>
                          {etaToDestination > 0 ? `${etaToDestination} min` : 'Arrived'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Predicted Arrival</p>
                        <p className="text-lg font-bold text-gray-700">{predictedArrivalStr}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Live tracking
                      </span>
                      <span>Updated just now</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })()}

        {/* Vehicle markers from live tracking - Only show when no route is selected */}
        {!selectedRoute && vehicles.map((vehicle) => (
          <Marker
            key={`vehicle-${vehicle.id}`}
            position={[vehicle.current_latitude, vehicle.current_longitude]}
            icon={createVehicleIcon(vehicle.transport_type || 'bus')}
          >
            <Popup>
              <div className="min-w-[260px] bg-white rounded-lg shadow-lg overflow-hidden" style={{ margin: '-14px -20px' }}>
                {/* Header */}
                <div className="px-4 py-3 bg-blue-600 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚌</span>
                    <div>
                      <p className="font-bold">{vehicle.vehicle_number}</p>
                      <p className="text-xs text-white/80">{vehicle.route_name}</p>
                    </div>
                  </div>
                </div>
                
                {/* Current Location */}
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600 font-medium uppercase">Current Location</span>
                  </div>
                  <p className="font-semibold text-gray-800 mt-1">{vehicle.current_stop_name}</p>
                </div>
                
                {/* Next Stop */}
                {vehicle.next_stop_name && (
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <span className="text-xs text-gray-500 font-medium uppercase">Next Stop</span>
                    </div>
                    <p className="font-medium text-gray-700 mt-1">{vehicle.next_stop_name}</p>
                  </div>
                )}
                
                {/* Progress */}
                <div className="px-4 py-3 bg-gray-50">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-bold text-blue-600">{Math.round(vehicle.progress_percent)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
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