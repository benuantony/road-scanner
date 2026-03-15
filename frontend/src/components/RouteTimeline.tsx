import { useMemo, useState, useEffect } from 'react';
import { Route, Vehicle } from '../types';

// Collapse states: 'expanded' | 'mini' | 'collapsed'
type CollapseState = 'expanded' | 'mini' | 'collapsed';

interface RouteTimelineProps {
  route: Route;
  vehicles: Vehicle[];
  isConnected: boolean;
  onClose: () => void;
  onStopSelect?: (stopIndex: number, latitude: number, longitude: number) => void;
  onCurrentStopChange?: (currentStopIndex: number) => void;
  collapseState?: CollapseState; // External control for collapse state
  onCollapseStateChange?: (state: CollapseState) => void;
}

export default function RouteTimeline({ 
  route, 
  vehicles, 
  isConnected, 
  onClose, 
  onStopSelect, 
  onCurrentStopChange,
  collapseState: externalCollapseState,
  onCollapseStateChange 
}: RouteTimelineProps) {
  const [internalCollapseState, setInternalCollapseState] = useState<CollapseState>('expanded');
  
  // Use external state if provided, otherwise use internal
  const collapseState = externalCollapseState ?? internalCollapseState;
  const setCollapseState = (state: CollapseState) => {
    if (onCollapseStateChange) {
      onCollapseStateChange(state);
    } else {
      setInternalCollapseState(state);
    }
  };

  // Sync internal state with external state
  useEffect(() => {
    if (externalCollapseState !== undefined) {
      setInternalCollapseState(externalCollapseState);
    }
  }, [externalCollapseState]);

  const stops = route.stops || [];
  const isMetro = route.transport_type === 'metro';
  const isVolvo = route.operator?.includes('Volvo');
  const isVajra = route.operator?.includes('Vajra');
  
  // Get colors based on operator
  const headerBgColor = isMetro 
    ? 'bg-gradient-to-r from-purple-600 to-purple-700' 
    : isVolvo 
      ? 'bg-gradient-to-r from-blue-600 to-blue-700'
      : isVajra
        ? 'bg-gradient-to-r from-orange-500 to-orange-600'
        : 'bg-gradient-to-r from-green-600 to-green-700';

  const accentColorClass = isMetro ? 'text-purple-600' : isVolvo ? 'text-blue-600' : isVajra ? 'text-orange-600' : 'text-green-600';
  const progressBgClass = isMetro 
    ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
    : isVolvo 
      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
      : isVajra
        ? 'bg-gradient-to-r from-orange-500 to-orange-600'
        : 'bg-gradient-to-r from-green-500 to-green-600';

  // Get emoji
  const getEmoji = () => {
    if (isMetro) return '🚇';
    if (isVolvo) return '🚎';
    if (isVajra) return '🚐';
    return '🚌';
  };
  
  // Simulate current stop index based on timestamp (randomized per route)
  const currentStopIndex = useMemo(() => {
    const now = Date.now();
    const minuteOfDay = Math.floor((now % (24 * 60 * 60 * 1000)) / 60000);
    const seed = route.id + minuteOfDay;
    const progress = (seed % 100) / 100;
    const idx = Math.floor(progress * stops.length);
    return Math.min(idx, stops.length - 1);
  }, [route.id, stops.length]);

  // Notify parent about current stop index changes
  useMemo(() => {
    if (onCurrentStopChange && stops.length > 0) {
      onCurrentStopChange(currentStopIndex);
    }
  }, [currentStopIndex, onCurrentStopChange, stops.length]);

  // Handle stop click to focus on map
  const handleStopClick = (index: number) => {
    if (onStopSelect && stops[index]) {
      onStopSelect(index, stops[index].latitude, stops[index].longitude);
    }
  };

  // Calculate total route info
  const totalDistance = stops.length > 0 ? stops[stops.length - 1].distance || 0 : 0;
  const totalTime = stops.length > 0 ? stops[stops.length - 1].arrival_offset || 0 : 0;

  // Get origin and destination names
  const originName = stops[0]?.stop_name || 'Start';
  const destName = stops[stops.length - 1]?.stop_name || 'End';
  const currentStopName = stops[currentStopIndex]?.stop_name || '';
  const nextStopName = currentStopIndex < stops.length - 1 ? stops[currentStopIndex + 1]?.stop_name : '';
  
  // Count stops by status
  const passedCount = currentStopIndex;
  const upcomingCount = stops.length - currentStopIndex - 1;
  const progressPercent = stops.length > 1 ? Math.round((currentStopIndex / (stops.length - 1)) * 100) : 0;
  
  // Calculate ETA to destination
  const currentArrivalOffset = stops[currentStopIndex]?.arrival_offset || 0;
  const finalArrivalOffset = stops[stops.length - 1]?.arrival_offset || 0;
  const etaToDestination = finalArrivalOffset - currentArrivalOffset;
  
  // Calculate next stop ETA
  const nextStopEta = currentStopIndex < stops.length - 1 
    ? (stops[currentStopIndex + 1]?.arrival_offset || 0) - currentArrivalOffset
    : 0;

  // Calculate predicted arrival time
  const now = new Date();
  const predictedArrival = new Date(now.getTime() + etaToDestination * 60000);
  const predictedArrivalStr = predictedArrival.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const getStopStatus = (index: number) => {
    if (index < currentStopIndex) return 'reached';
    if (index === currentStopIndex) return 'current';
    return 'upcoming';
  };

  const getStopColor = (status: string) => {
    switch (status) {
      case 'reached': return isMetro ? 'bg-purple-500' : isVolvo ? 'bg-blue-500' : isVajra ? 'bg-orange-500' : 'bg-green-500';
      case 'current': return 'bg-orange-500';
      case 'upcoming': return isMetro ? 'bg-purple-200' : isVolvo ? 'bg-blue-200' : isVajra ? 'bg-orange-200' : 'bg-green-200';
      default: return 'bg-gray-300';
    }
  };

  const getLineColor = (fromStatus: string) => {
    if (fromStatus === 'reached' || fromStatus === 'current') {
      return isMetro ? 'bg-purple-400' : isVolvo ? 'bg-blue-400' : isVajra ? 'bg-orange-400' : 'bg-green-400';
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
    if (stopIndex < currentStopIndex) return null;
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

  const getStopTiming = (stopIndex: number) => {
    const scheduledOffset = stops[stopIndex]?.arrival_offset || 0;
    const seed = route.id * 1000 + stopIndex;
    const delayMins = stopIndex < currentStopIndex 
      ? Math.floor((seed % 14) + 2)
      : Math.floor((seed % 8));
    
    const routeStartTime = new Date();
    const elapsedMins = stops[currentStopIndex]?.arrival_offset || 0;
    routeStartTime.setMinutes(routeStartTime.getMinutes() - elapsedMins);
    
    const scheduledTime = new Date(routeStartTime);
    scheduledTime.setMinutes(scheduledTime.getMinutes() + scheduledOffset);
    
    const actualTime = new Date(scheduledTime);
    actualTime.setMinutes(actualTime.getMinutes() + delayMins);
    
    return {
      scheduled: scheduledTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      actual: actualTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      delay: delayMins,
    };
  };

  // Cycle through collapse states
  const cycleCollapseState = () => {
    const states: CollapseState[] = ['expanded', 'mini', 'collapsed'];
    const currentIndex = states.indexOf(collapseState);
    const nextIndex = (currentIndex + 1) % states.length;
    setCollapseState(states[nextIndex]);
  };

  // Get height class based on state
  const getHeightClass = () => {
    switch (collapseState) {
      case 'collapsed': return 'max-h-[60px]';
      case 'mini': return 'max-h-[160px]';
      case 'expanded': return 'max-h-[50vh]';
    }
  };

  return (
    <div className={`bg-white border-t-2 border-gray-200 shadow-lg flex flex-col transition-all duration-300 ease-in-out ${getHeightClass()}`}>
      {/* Header - Always Visible */}
      <div className={`px-4 py-2.5 flex items-center justify-between flex-shrink-0 ${headerBgColor}`}>
        {/* Left: Route Info & Flow */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{getEmoji()}</span>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-bold text-white text-sm">{route.route_number}</span>
            <span className="text-white/60">|</span>
            <div className="flex items-center gap-1.5 text-white/90 text-sm truncate">
              <span className="truncate max-w-[100px]">{originName}</span>
              <span className="text-white/60">→</span>
              <span className="truncate max-w-[100px]">{destName}</span>
            </div>
          </div>
        </div>

        {/* Center: Legend (collapsed) OR Stats (expanded) */}
        {collapseState === 'collapsed' ? (
          <div className="flex items-center gap-3 text-xs px-4">
            <div className="flex items-center gap-1">
              <span className={`w-2.5 h-2.5 rounded-full ${isMetro ? 'bg-purple-300' : isVolvo ? 'bg-blue-300' : isVajra ? 'bg-orange-300' : 'bg-green-300'}`}></span>
              <span className="text-white/80">{passedCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></span>
              <span className="text-white font-medium">1</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2.5 h-2.5 rounded-full opacity-50 ${isMetro ? 'bg-purple-200' : isVolvo ? 'bg-blue-200' : isVajra ? 'bg-orange-200' : 'bg-green-200'}`}></span>
              <span className="text-white/80">{upcomingCount}</span>
            </div>
            <span className="text-white/50">|</span>
            <span className="text-white/90 font-medium">{etaToDestination > 0 ? `${etaToDestination}m` : 'Arrived'}</span>
          </div>
        ) : collapseState === 'expanded' ? (
          <div className="hidden md:flex items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <span>🚏</span>
              <span>{stops.length}</span>
            </div>
            {totalDistance > 0 && (
              <div className="flex items-center gap-1">
                <span>📏</span>
                <span>{totalDistance.toFixed(1)}km</span>
              </div>
            )}
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span>~{formatTime(totalTime)}</span>
              </div>
            )}
          </div>
        ) : null}
        
        {/* Right: Live Status + Toggle + Close */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
            isConnected ? 'bg-green-500/20 text-green-100' : 'bg-gray-500/20 text-gray-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="hidden sm:inline">{isConnected ? 'Live' : 'Offline'}</span>
          </div>

          <button
            onClick={cycleCollapseState}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={collapseState === 'expanded' ? 'Minimize' : collapseState === 'mini' ? 'Collapse' : 'Expand'}
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${
                collapseState === 'expanded' ? 'rotate-180' : collapseState === 'mini' ? 'rotate-90' : ''
              }`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          
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

      {/* Mini View - Progress + Current/Next + ETA */}
      {collapseState === 'mini' && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Progress</span>
              <span className={`font-bold ${accentColorClass}`}>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${progressBgClass}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>✓ {passedCount} passed</span>
              <span>○ {upcomingCount} remaining</span>
            </div>
          </div>

          {/* Current & Next Stop Row */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse flex-shrink-0"></span>
                <span className="text-orange-600 font-medium truncate">{currentStopName}</span>
              </div>
            </div>
            {nextStopName && (
              <>
                <span className="text-gray-400 flex-shrink-0">→</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${isMetro ? 'bg-purple-400' : isVolvo ? 'bg-blue-400' : isVajra ? 'bg-orange-400' : 'bg-green-400'}`}></span>
                    <span className="text-gray-600 truncate">{nextStopName}</span>
                    {nextStopEta > 0 && (
                      <span className={`text-xs font-medium ${accentColorClass}`}>({nextStopEta}m)</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ETA Row */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">🎯 ETA:</span>
              <span className={`font-bold ${accentColorClass}`}>
                {etaToDestination > 0 ? `${etaToDestination} min` : 'Arrived'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Arrival:</span>
              <span className="font-medium text-gray-700">{predictedArrivalStr}</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Mini Info Bar */}
      {collapseState === 'collapsed' && (
        <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-orange-600 font-medium">📍 {currentStopName}</span>
            {nextStopEta > 0 && (
              <>
                <span className="text-gray-400">→</span>
                <span className="text-gray-600">Next in {nextStopEta}m</span>
              </>
            )}
          </div>
          <span className="text-gray-400">Click ▲ to expand</span>
        </div>
      )}

      {/* Expanded Content */}
      {collapseState === 'expanded' && (
        <>
          {/* Visual Timeline */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">Progress:</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-full ${isMetro ? 'bg-purple-500' : isVolvo ? 'bg-blue-500' : isVajra ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                  <span className="text-gray-600">Passed ({passedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
                  <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-full ${isMetro ? 'bg-purple-200' : isVolvo ? 'bg-blue-200' : isVajra ? 'bg-orange-200' : 'bg-green-200'}`}></span>
                  <span className="text-gray-600">Upcoming ({upcomingCount})</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                Stop {currentStopIndex + 1} of {stops.length}
              </span>
            </div>

            <div className="overflow-x-auto py-2">
              <div className="flex items-center min-w-max gap-0.5">
                {stops.map((stop, index) => {
                  const status = getStopStatus(index);
                  const isFirst = index === 0;
                  const isLast = index === stops.length - 1;
                  
                  return (
                    <div key={stop.stop_id} className="flex items-center group relative">
                      <div 
                        className={`
                          rounded-full transition-all cursor-pointer
                          ${getStopColor(status)}
                          ${isFirst || isLast ? 'w-4 h-4' : 'w-2.5 h-2.5'}
                          ${status === 'current' ? 'ring-2 ring-orange-300 animate-pulse w-4 h-4' : ''}
                        `}
                        title={stop.stop_name}
                        onClick={() => handleStopClick(index)}
                      />
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {stop.stop_name}
                        </div>
                      </div>
                      {index < stops.length - 1 && (
                        <div className={`h-0.5 w-3 ${getLineColor(status)}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stop List */}
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
                      onClick={() => handleStopClick(index)}
                      className={`
                        cursor-pointer transition-colors
                        ${status === 'current' ? 'bg-orange-50 hover:bg-orange-100' : ''}
                        ${status === 'reached' ? 'bg-gray-50/50 hover:bg-gray-100' : ''}
                        ${status === 'upcoming' ? 'hover:bg-blue-50' : ''}
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
                            status === 'reached' ? accentColorClass : 'text-gray-400'
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
                        status === 'reached' ? 'text-gray-600' : accentColorClass
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

          {vehicles.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500">Active:</span>
                <div className="flex flex-wrap gap-1.5">
                  {vehicles.slice(0, 3).map(vehicle => (
                    <span
                      key={vehicle.id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                        isMetro ? 'bg-purple-100 text-purple-700' : isVolvo ? 'bg-blue-100 text-blue-700' : isVajra ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
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
        </>
      )}
    </div>
  );
}