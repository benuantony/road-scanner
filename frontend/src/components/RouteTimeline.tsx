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
  
  // Simulate current stop index based on timestamp (randomized per route)
  const currentStopIndex = useMemo(() => {
    // Use route ID and current time to create a pseudo-random but consistent position
    const now = Date.now();
    const minuteOfDay = Math.floor((now % (24 * 60 * 60 * 1000)) / 60000);
    const seed = route.id + minuteOfDay;
    
    // This creates a position that changes every ~3 minutes and varies by route
    const progress = (seed % 100) / 100;
    const idx = Math.floor(progress * stops.length);
    return Math.min(idx, stops.length - 1);
  }, [route.id, stops.length]);

  // Calculate total route info
  const totalDistance = stops.length > 0 ? stops[stops.length - 1].distance || 0 : 0;
  const totalTime = stops.length > 0 ? stops[stops.length - 1].arrival_offset || 0 : 0;

  const getStopStatus = (index: number) => {
    if (index < currentStopIndex) return 'reached';
    if (index === currentStopIndex) return 'current';
    return 'upcoming';
  };

  const getStopColor = (status: string) => {
    switch (status) {
      case 'reached': return isMetro ? 'bg-purple-500' : 'bg-green-500';
      case 'current': return 'bg-orange-500';
      case 'upcoming': return isMetro ? 'bg-purple-200' : 'bg-blue-200';
      default: return 'bg-gray-300';
    }
  };

  const getLineColor = (fromStatus: string) => {
    if (fromStatus === 'reached' || fromStatus === 'current') {
      return isMetro ? 'bg-purple-400' : 'bg-green-400';
    }
    return 'bg-gray-200';
  };

  const formatTime = (mins: number) => {
    if (mins < 0) mins = 0;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  };

  const calculateETA = (stopIndex: number) => {
    if (stopIndex < currentStopIndex) return null; // Already passed
    if (stopIndex === currentStopIndex) return 0;
    const currentTime = stops[currentStopIndex]?.arrival_offset || 0;
    const stopTime = stops[stopIndex]?.arrival_offset || 0;
    return Math.max(0, stopTime - currentTime);
  };

  const formatRealTime = (etaMins: number | null) => {
    if (etaMins === null) return '-';
    if (etaMins === 0) return 'Now';
    const now = new Date();
    now.setMinutes(now.getMinutes() + etaMins);
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate scheduled and actual times for passed stops
  const getStopTiming = (stopIndex: number) => {
    const scheduledOffset = stops[stopIndex]?.arrival_offset || 0;
    
    // Simulate random delay (Bangalore traffic! 2-15 mins for passed stops)
    const seed = route.id * 1000 + stopIndex;
    const delayMins = stopIndex < currentStopIndex 
      ? Math.floor((seed % 14) + 2) // 2-15 mins delay for passed stops
      : Math.floor((seed % 8)); // 0-7 mins delay for upcoming (predicted)
    
    // Calculate base scheduled time (assume route started X minutes ago)
    const routeStartTime = new Date();
    const elapsedMins = stops[currentStopIndex]?.arrival_offset || 0;
    routeStartTime.setMinutes(routeStartTime.getMinutes() - elapsedMins);
    
    // Scheduled time
    const scheduledTime = new Date(routeStartTime);
    scheduledTime.setMinutes(scheduledTime.getMinutes() + scheduledOffset);
    
    // Actual time (scheduled + delay)
    const actualTime = new Date(scheduledTime);
    actualTime.setMinutes(actualTime.getMinutes() + delayMins);
    
    return {
      scheduled: scheduledTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      actual: actualTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      delay: delayMins,
    };
  };

  return (
    <div className="bg-white border-t-2 border-gray-200 shadow-lg max-h-[50vh] flex flex-col">
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between flex-shrink-0 ${
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
          <div className="flex items-center gap-4 text-white/90 text-sm">
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
                <span>~{formatTime(totalTime)}</span>
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

      {/* Visual Timeline - Just Dots */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-500">Progress:</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${isMetro ? 'bg-purple-500' : 'bg-green-500'}`}></span>
              <span className="text-gray-600">Passed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-gray-600">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${isMetro ? 'bg-purple-200' : 'bg-blue-200'}`}></span>
              <span className="text-gray-600">Upcoming</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            Stop {currentStopIndex + 1} of {stops.length}
          </span>
        </div>

        {/* Dot Timeline */}
        <div className="overflow-x-auto py-2">
          <div className="flex items-center min-w-max gap-0.5">
            {stops.map((stop, index) => {
              const status = getStopStatus(index);
              const isFirst = index === 0;
              const isLast = index === stops.length - 1;
              
              return (
                <div key={stop.stop_id} className="flex items-center group relative">
                  {/* Dot */}
                  <div 
                    className={`
                      rounded-full transition-all cursor-pointer
                      ${getStopColor(status)}
                      ${isFirst || isLast ? 'w-4 h-4' : 'w-2.5 h-2.5'}
                      ${status === 'current' ? 'ring-2 ring-orange-300 animate-pulse w-4 h-4' : ''}
                    `}
                    title={stop.stop_name}
                  />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {stop.stop_name}
                    </div>
                  </div>
                  
                  {/* Connecting line */}
                  {index < stops.length - 1 && (
                    <div className={`h-0.5 w-3 ${getLineColor(status)}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stop List with ETA */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="text-left text-xs text-gray-500 uppercase">
              <th className="px-3 py-2 w-10">#</th>
              <th className="px-2 py-2 w-14">Status</th>
              <th className="px-2 py-2">Stop Name</th>
              <th className="px-2 py-2 text-right w-16">Sched.</th>
              <th className="px-2 py-2 text-right w-16">Actual</th>
              <th className="px-2 py-2 text-right w-16">Delay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stops.map((stop, index) => {
              const status = getStopStatus(index);
              const eta = calculateETA(index);
              const timing = getStopTiming(index);
              
              return (
                <tr 
                  key={stop.stop_id}
                  className={`
                    ${status === 'current' ? 'bg-orange-50' : ''}
                    ${status === 'reached' ? 'bg-gray-50/50' : ''}
                    ${status === 'upcoming' ? 'hover:bg-blue-50/30' : ''}
                  `}
                >
                  <td className="px-3 py-1.5 text-gray-400 text-xs">{index + 1}</td>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${getStopColor(status)} ${
                        status === 'current' ? 'animate-pulse' : ''
                      }`}></span>
                      <span className={`text-xs ${
                        status === 'current' ? 'text-orange-600 font-medium' :
                        status === 'reached' ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {status === 'current' ? '●' : status === 'reached' ? '✓' : '○'}
                      </span>
                    </div>
                  </td>
                  <td className={`px-2 py-1.5 text-sm ${
                    status === 'current' ? 'font-semibold text-gray-900' :
                    status === 'reached' ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {stop.stop_name}
                  </td>
                  <td className={`px-2 py-1.5 text-right text-xs font-mono ${
                    status === 'reached' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {timing.scheduled}
                  </td>
                  <td className={`px-2 py-1.5 text-right text-xs font-mono ${
                    status === 'current' ? 'text-orange-600 font-semibold' :
                    status === 'reached' ? 'text-gray-600' : 'text-blue-600'
                  }`}>
                    {status === 'upcoming' ? formatRealTime(eta) : timing.actual}
                  </td>
                  <td className={`px-2 py-1.5 text-right text-xs font-medium ${
                    timing.delay > 10 ? 'text-red-500' :
                    timing.delay > 5 ? 'text-orange-500' :
                    timing.delay > 0 ? 'text-yellow-600' : 'text-green-500'
                  }`}>
                    {timing.delay > 0 ? `+${timing.delay}m` : 'On time'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Active Vehicles (compact) */}
      {vehicles.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500">Active:</span>
            <div className="flex flex-wrap gap-1.5">
              {vehicles.slice(0, 3).map(vehicle => (
                <span
                  key={vehicle.id}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                    isMetro ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  {vehicle.vehicle_number}
                </span>
              ))}
              {vehicles.length > 3 && (
                <span className="text-gray-400">+{vehicles.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}