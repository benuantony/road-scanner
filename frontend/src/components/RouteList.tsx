import { Route } from '../types';

interface RouteListProps {
  routes: Route[];
  selectedRoute: Route | null;
  onSelectRoute: (route: Route) => void;
  isLoading?: boolean;
}

export default function RouteList({
  routes,
  selectedRoute,
  onSelectRoute,
  isLoading = false,
}: RouteListProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-green-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="mt-2 text-gray-500">Finding bus routes...</p>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <span className="text-5xl block mb-4">🚌</span>
          <p className="text-gray-500 font-medium">No bus routes found</p>
          <p className="text-gray-400 text-sm mt-1">
            Search for routes between bus stops
          </p>
        </div>
      </div>
    );
  }

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span>🚌</span>
          Available Routes ({routes.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {routes.map((route) => {
          const isSelected = selectedRoute?.id === route.id;

          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(route)}
              className={`route-card w-full p-4 text-left transition-all ${
                isSelected
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl p-2 rounded-lg bg-green-100">
                  🚌
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-green-700">
                      {route.route_number}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      {route.operator}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-0.5">
                    {route.route_name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span>🚏</span>
                      {route.stops.length} stops
                    </span>
                    {route.total_distance && (
                      <span className="flex items-center gap-1">
                        <span>📍</span>
                        {route.total_distance} km
                      </span>
                    )}
                    {route.total_time && (
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        {formatDuration(route.total_time)}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <svg
                    className="h-5 w-5 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Stop list preview */}
              {isSelected && route.stops.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center text-xs text-gray-500 overflow-x-auto pb-1">
                    {route.stops.map((stop, index) => (
                      <div key={stop.stop_id} className="flex items-center">
                        <span className="whitespace-nowrap px-1 py-0.5 bg-green-50 rounded">
                          {stop.stop_name.split(' ')[0]}
                        </span>
                        {index < route.stops.length - 1 && (
                          <span className="text-green-400 mx-1">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}