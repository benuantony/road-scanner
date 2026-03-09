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
          <h3 className="font-semibold text-gray-800">Live Tracking</h3>
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
          {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} active
        </span>
      </div>

      {/* Vehicle list */}
      <div className="max-h-64 overflow-y-auto">
        {filteredVehicles.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="h-12 w-12 text-gray-300 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <p className="text-gray-500">
              {selectedRoute
                ? 'No vehicles on this route'
                : 'Select a route to see vehicles'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredVehicles.map((vehicle) => {
              const isBus = vehicle.transport_type === 'bus';
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
                    <span
                      className={`text-xl p-2 rounded-lg ${
                        isBus ? 'bg-green-100' : 'bg-amber-100'
                      }`}
                    >
                      {isBus ? '🚌' : '🚃'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
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
                          {vehicle.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {vehicle.route_number} - {vehicle.route_name}
                      </p>

                      {/* Progress visualization */}
                      <div className="mt-3">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <span className="font-medium">
                            {vehicle.current_stop_name}
                          </span>
                          {vehicle.next_stop_name && (
                            <>
                              <svg
                                className="h-3 w-3 mx-2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                              <span>{vehicle.next_stop_name}</span>
                            </>
                          )}
                        </div>
                        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`absolute h-full rounded-full transition-all duration-500 progress-bar ${
                              isBus ? 'bg-green-500' : 'bg-amber-500'
                            }`}
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
                                        ? 'bg-gray-400'
                                        : index === currentStopIndex
                                        ? isBus
                                          ? 'bg-green-500 ring-2 ring-green-200'
                                          : 'bg-amber-500 ring-2 ring-amber-200'
                                        : 'bg-gray-300'
                                    }`}
                                    title={stop.stop_name}
                                  />
                                  {index < routeStops.length - 1 &&
                                    index < 5 && (
                                      <div
                                        className={`w-4 h-0.5 ${
                                          index < currentStopIndex
                                            ? 'bg-gray-400'
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