import { Vehicle, Route } from '../types';

interface LiveTrackerProps {
  vehicles: Vehicle[];
  selectedRoute: Route | null;
  isConnected: boolean;
}

export default function LiveTracker({
  vehicles,
  selectedRoute,
  isConnected,
}: LiveTrackerProps) {
  if (vehicles.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <span className="text-2xl">📍</span>
            <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              isConnected ? 'bg-cyan-400 animate-pulse' : 'bg-gray-500'
            }`}></span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Live Vehicle Tracking</h3>
            <p className="text-xs text-gray-500">
              {isConnected ? 'Connected to live updates' : 'Connecting...'}
            </p>
          </div>
        </div>
        <div className="text-center py-6">
          <p className="text-gray-400">
            {selectedRoute 
              ? 'No active buses on this route currently' 
              : 'Select a route to see live bus positions'}
          </p>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-2xl filter drop-shadow-lg">🚌</span>
              <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                isConnected ? 'bg-cyan-400 animate-pulse' : 'bg-gray-500'
              }`}></span>
            </div>
            <div>
              <h3 className="font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Live Bus Tracking
              </h3>
              <p className="text-xs text-gray-500">
                {vehicles.length} active {vehicles.length === 1 ? 'bus' : 'buses'}
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full ${
            isConnected 
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
              : 'bg-gray-800 text-gray-500 border border-gray-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-cyan-400 animate-pulse' : 'bg-gray-500'}`}></span>
            {isConnected ? 'Live' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              {/* Vehicle Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg filter drop-shadow-lg">🚌</span>
                  <span className="font-bold text-cyan-400">{vehicle.vehicle_number}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  vehicle.status === 'running' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : vehicle.status === 'delayed'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                }`}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </div>

              {/* Route Info */}
              <div className="mb-3">
                <p className="text-sm text-gray-300">{vehicle.route_name}</p>
              </div>

              {/* Current & Next Stop */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 text-xs mt-0.5">📍</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Current Stop</p>
                    <p className="text-sm text-white truncate">{vehicle.current_stop_name}</p>
                  </div>
                </div>
                {vehicle.next_stop_name && (
                  <div className="flex items-start gap-2">
                    <span className="text-purple-400 text-xs mt-0.5">➡️</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Next Stop</p>
                      <p className="text-sm text-gray-300 truncate">{vehicle.next_stop_name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Route Progress</span>
                  <span className="text-cyan-400 font-medium">{Math.round(vehicle.progress_percent)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 relative"
                    style={{ width: `${vehicle.progress_percent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-between">
                <span className="text-xs text-gray-600">Last updated</span>
                <span className="text-xs text-gray-400">{formatTime(vehicle.last_updated)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      {vehicles.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Running: {vehicles.filter(v => v.status === 'running').length}
              </span>
              {vehicles.some(v => v.status === 'delayed') && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Delayed: {vehicles.filter(v => v.status === 'delayed').length}
                </span>
              )}
            </div>
            <span className="text-gray-600">
              Updates every 5 seconds
            </span>
          </div>
        </div>
      )}
    </div>
  );
}