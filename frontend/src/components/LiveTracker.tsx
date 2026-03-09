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
  // Filter vehicles for the selected route
  const filteredVehicles = selectedRoute
    ? vehicles.filter((v) => v.route_id === selectedRoute.id)
    : vehicles;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🚌</span>
          <h3 className="font-semibold text-gray-800">Live Bus Tracking</h3>
          <span
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
              isConnected
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {filteredVehicles.length} bus{filteredVehicles.length !== 1 ? 'es' : ''} active
        </span>
      </div>

      {/* Vehicle list */}
      <div className="max-h-64 overflow-y-auto">
        {filteredVehicles.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-4xl block mb-3">🚏</span>
            <p className="text-gray-500">
              {selectedRoute
                ? 'No buses currently on this route'
                : 'Select a route to see live bus tracking'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredVehicles.map((vehicle) => {
              const routeStops = selectedRoute?.stops || [];
              const currentStopIndex = routeStops.findIndex(
                (s) => s.stop_id === vehicle.current_stop_id
              );

              return (
                <div
                  key={vehicle.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl p-2 rounded-lg bg-green-100">
                      🚌
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800">
                          {vehicle.vehicle_number}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            vehicle.status === 'running'
                              ? 'bg-green-100 text-green-700'
                              : vehicle.status === 'delayed'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {vehicle.status === 'running' ? '● Running' : vehicle.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {vehicle.route_number} - {vehicle.route_name}
                      </p>

                      {/* Progress visualization */}
                      <div className="mt-3">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <span className="font-medium text-gray-700">
                            📍 {vehicle.current_stop_name}
                          </span>
                          {vehicle.next_stop_name && (
                            <>
                              <span className="mx-2 text-green-500">→</span>
                              <span>{vehicle.next_stop_name}</span>
                            </>
                          )}
                        </div>
                        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="absolute h-full rounded-full transition-all duration-500 progress-bar bg-green-500"
                            style={{ width: `${vehicle.progress_percent}%` }}
                          />
                        </div>

                        {/* Route stops indicator */}
                        {selectedRoute && currentStopIndex !== -1 && (
                          <div className="flex items-center justify-between mt-2 text-xs">
                            <div className="flex items-center gap-1 overflow-hidden">
                              {routeStops.slice(0, 6).map((stop, index) => (
                                <div
                                  key={stop.stop_id}
                                  className="flex items-center"
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                      index < currentStopIndex
                                        ? 'bg-green-400'
                                        : index === currentStopIndex
                                        ? 'bg-green-500 ring-2 ring-green-200'
                                        : 'bg-gray-300'
                                    }`}
                                    title={stop.stop_name}
                                  />
                                  {index < routeStops.length - 1 &&
                                    index < 5 && (
                                      <div
                                        className={`w-4 h-0.5 ${
                                          index < currentStopIndex
                                            ? 'bg-green-400'
                                            : 'bg-gray-300'
                                        }`}
                                      />
                                    )}
                                </div>
                              ))}
                              {routeStops.length > 6 && (
                                <span className="text-gray-400 ml-1">
                                  +{routeStops.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatTime(vehicle.last_updated)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}