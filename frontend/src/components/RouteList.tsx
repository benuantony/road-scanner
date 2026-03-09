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
            className="animate-spin h-8 w-8 text-blue-500 mx-auto"
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
          <p className="mt-2 text-gray-500">Finding routes...</p>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <svg
            className="h-16 w-16 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p className="text-gray-500 font-medium">No routes found</p>
          <p className="text-gray-400 text-sm mt-1">
            Search for routes between stops
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
        <h3 className="font-semibold text-gray-800">
          Available Routes ({routes.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {routes.map((route) => {
          const isSelected = selectedRoute?.id === route.id;
          const isBus = route.transport_type === 'bus';

          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(route)}
              className={`route-card w-full p-4 text-left transition-all ${
                isSelected
                  ? isBus
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'bg-amber-50 border-l-4 border-amber-500'
                  : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`text-2xl p-2 rounded-lg ${
                    isBus ? 'bg-green-100' : 'bg-amber-100'
                  }`}
                >
                  {isBus ? '🚌' : '🚃'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        isBus ? 'text-green-700' : 'text-amber-700'
                      }`}
                    >
                      {route.route_number}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isBus
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {route.operator}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-0.5">
                    {route.route_name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      {route.stops.length} stops
                    </span>
                    {route.total_distance && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                        {route.total_distance} km
                      </span>
                    )}
                    {route.total_time && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatDuration(route.total_time)}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <svg
                    className={`h-5 w-5 ${
                      isBus ? 'text-green-500' : 'text-amber-500'
                    }`}
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
                        <span className="whitespace-nowrap px-1">
                          {stop.stop_name.split(' ')[0]}
                        </span>
                        {index < route.stops.length - 1 && (
                          <svg
                            className="h-3 w-3 text-gray-400 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
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