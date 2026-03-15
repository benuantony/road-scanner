import { useMemo } from 'react';
import { Route, Vehicle } from '../types';

interface RouteTimelineProps {
  route: Route;
  vehicles: Vehicle[];
  isConnected: boolean;
  onClose: () => void;
}

export default function RouteTimeline({ route, vehicles, isConnected, onClose }: RouteTimelineProps) {
  const stops = route.stops || [];
  const isMetro = route.transport_type === 'metro';
  
  // Find vehicle positions on the route
  const vehiclePositions = useMemo(() => {
    const positions: { [stopId: number]: Vehicle[] } = {};
    vehicles.forEach(v => {
      if (v.current_stop_id) {
        if (!positions[v.current_stop_id]) positions[v.current_stop_id] = [];
        positions[v.current_stop_id].push(v);
      }
    });
    return positions;
  }, [vehicles]);

  // Calculate total route info
  const totalDistance = stops.length > 0 ? stops[stops.length - 1].distance || 0 : 0;
  const totalTime = stops.length > 0 ? stops[stops.length - 1].arrival_offset || 0 : 0;

  return (
    <div className="bg-white border-t-2 border-gray-200 shadow-lg animate-slide-up">
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${
        isMetro ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isMetro ? '🚇' : '🚌'}</span>
          <div>
            <h3 className="font-bold text-white text-lg">{route.route_number}</h3>
            <p className="text-white/80 text-sm">{route.route_name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Route Stats */}
          <div className="flex items-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <span>🚏</span>
              <span>{stops.length} stops</span>
            </div>
            {totalDistance > 0 && (
              <div className="flex items-center gap-1">
                <span>📏</span>
                <span>{totalDistance.toFixed(1)} km</span>
              </div>
            )}
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span>~{Math.round(totalTime)} min</span>
              </div>
            )}
          </div>
          
          {/* Live Status */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isConnected ? 'bg-green-500/20 text-green-100' : 'bg-gray-500/20 text-gray-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
            <span>{isConnected ? 'Live' : 'Offline'}</span>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex items-start min-w-max">
          {stops.map((stop, index) => {
            const isFirst = index === 0;
            const isLast = index === stops.length - 1;
            const hasVehicle = vehiclePositions[stop.stop_id]?.length > 0;
            const vehiclesHere = vehiclePositions[stop.stop_id] || [];
            
            return (
              <div key={stop.stop_id} className="flex flex-col items-center relative group">
                {/* Connection line */}
                {!isLast && (
                  <div className={`absolute top-5 left-1/2 w-24 h-1 ${
                    isMetro ? 'bg-purple-200' : 'bg-blue-200'
                  }`} style={{ transform: 'translateX(50%)' }}>
                    {/* Progress indicator if vehicle between stops */}
                  </div>
                )}
                
                {/* Stop marker */}
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-3 transition-all ${
                    isFirst || isLast
                      ? isMetro 
                        ? 'bg-purple-600 border-purple-700 text-white' 
                        : 'bg-blue-600 border-blue-700 text-white'
                      : hasVehicle
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'bg-white border-gray-300 text-gray-500'
                  } ${hasVehicle ? 'ring-4 ring-green-200 animate-pulse' : ''}`}>
                    {hasVehicle ? (
                      <span className="text-lg">{isMetro ? '🚇' : '🚌'}</span>
                    ) : isFirst || isLast ? (
                      <span className="text-lg">{isFirst ? '🏁' : '🎯'}</span>
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Vehicle count badge */}
                  {vehiclesHere.length > 1 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {vehiclesHere.length}
                    </span>
                  )}
                </div>
                
                {/* Stop info */}
                <div className="mt-2 text-center w-24">
                  <p className={`text-xs font-medium truncate ${
                    isFirst || isLast ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {stop.stop_name}
                  </p>
                  {stop.arrival_offset !== undefined && stop.arrival_offset > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      +{stop.arrival_offset} min
                    </p>
                  )}
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    <p className="font-medium">{stop.stop_name}</p>
                    {stop.distance > 0 && <p className="text-gray-400">{stop.distance} km from start</p>}
                    {vehiclesHere.length > 0 && (
                      <p className="text-green-400 mt-1">
                        {vehiclesHere.length} {isMetro ? 'train' : 'bus'}{vehiclesHere.length > 1 ? 'es' : ''} here
                      </p>
                    )}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Vehicles */}
      {vehicles.length > 0 && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Active Vehicles ({vehicles.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {vehicles.slice(0, 5).map(vehicle => (
              <div
                key={vehicle.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  isMetro ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                }`}
              >
                <span>{isMetro ? '🚇' : '🚌'}</span>
                <span className="font-medium">{vehicle.vehicle_number}</span>
                <span className="text-xs opacity-60">
                  at {vehicle.current_stop_name?.substring(0, 15)}...
                </span>
              </div>
            ))}
            {vehicles.length > 5 && (
              <span className="text-sm text-gray-400 self-center">
                +{vehicles.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}