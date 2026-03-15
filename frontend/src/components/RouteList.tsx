import { Route } from '../types';

interface RouteListProps {
  routes: Route[];
  selectedRoute: Route | null;
  onSelectRoute: (route: Route) => void;
  isLoading?: boolean;
  transportFilter?: 'all' | 'bus' | 'metro';
  onTransportFilterChange?: (filter: 'all' | 'bus' | 'metro') => void;
}

export default function RouteList({
  routes,
  selectedRoute,
  onSelectRoute,
  isLoading = false,
  transportFilter = 'all',
  onTransportFilterChange,
}: RouteListProps) {
  // Filter routes by transport type
  const filteredRoutes = transportFilter === 'all' 
    ? routes 
    : routes.filter(r => r.transport_type === transportFilter);

  // Count by type
  const busCount = routes.filter(r => r.transport_type === 'bus').length;
  const metroCount = routes.filter(r => r.transport_type === 'metro').length;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
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
          <p className="mt-3 text-gray-500">Finding routes...</p>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center p-6">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-700 font-medium">No routes found</p>
          <p className="text-gray-400 text-sm mt-1">
            Search for bus or metro routes
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
    return `${hours}h ${minutes}m`;
  };

  const getOperatorBadge = (route: Route) => {
    const isMetro = route.transport_type === 'metro';
    if (isMetro) {
      return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">Metro</span>;
    }
    if (route.operator?.includes('Volvo')) {
      return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">AC Volvo</span>;
    }
    if (route.operator?.includes('Vajra')) {
      return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-100 text-cyan-700">Airport</span>;
    }
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Regular</span>;
  };

  const getTransportIcon = (type: string) => {
    return type === 'metro' ? '🚇' : '🚌';
  };

  const getTransportColors = (type: string, isSelected: boolean) => {
    if (type === 'metro') {
      return {
        bg: isSelected ? 'bg-purple-50' : 'hover:bg-purple-50/50',
        border: isSelected ? 'border-l-4 border-purple-500' : 'border-l-4 border-transparent',
        iconBg: isSelected ? 'bg-purple-100' : 'bg-gray-100',
        text: isSelected ? 'text-purple-600' : 'text-gray-800',
      };
    }
    return {
      bg: isSelected ? 'bg-blue-50' : 'hover:bg-blue-50/50',
      border: isSelected ? 'border-l-4 border-blue-500' : 'border-l-4 border-transparent',
      iconBg: isSelected ? 'bg-blue-100' : 'bg-gray-100',
      text: isSelected ? 'text-blue-600' : 'text-gray-800',
    };
  };

  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col">
      {/* Header with Filter */}
      <div className="p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">
            Available Routes
          </h3>
          <span className="text-sm text-gray-400">({filteredRoutes.length})</span>
        </div>
        
        {/* Transport Type Filter */}
        {onTransportFilterChange && (
          <div className="flex gap-1">
            <button
              onClick={() => onTransportFilterChange('all')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                transportFilter === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({routes.length})
            </button>
            <button
              onClick={() => onTransportFilterChange('bus')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                transportFilter === 'bus'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              🚌 Bus ({busCount})
            </button>
            <button
              onClick={() => onTransportFilterChange('metro')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                transportFilter === 'metro'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              🚇 Metro ({metroCount})
            </button>
          </div>
        )}
      </div>

      {/* Routes List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filteredRoutes.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <span className="text-3xl block mb-2">
              {transportFilter === 'metro' ? '🚇' : '🚌'}
            </span>
            <p>No {transportFilter} routes found</p>
          </div>
        ) : (
          filteredRoutes.map((route) => {
            const isSelected = selectedRoute?.id === route.id;
            const colors = getTransportColors(route.transport_type, isSelected);

            return (
              <button
                key={route.id}
                onClick={() => onSelectRoute(route)}
                className={`w-full p-3 text-left transition-all ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start gap-3">
                  {/* Transport Icon */}
                  <div className={`text-xl p-2 rounded-lg ${colors.iconBg}`}>
                    {getTransportIcon(route.transport_type)}
                  </div>
                  
                  {/* Route Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold ${colors.text}`}>
                        {route.route_number}
                      </span>
                      {getOperatorBadge(route)}
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {route.route_name}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        🚏 {route.stops?.length || 0} stops
                      </span>
                      {route.total_distance && route.total_distance > 0 && (
                        <span className="flex items-center gap-1">
                          📍 {route.total_distance.toFixed(1)} km
                        </span>
                      )}
                      {route.total_time && route.total_time > 0 && (
                        <span className="flex items-center gap-1">
                          ⏱️ {formatDuration(route.total_time)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      route.transport_type === 'metro' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Compact stop preview */}
                {route.stops && route.stops.length > 0 && (
                  <div className="mt-2 flex items-center text-xs text-gray-400 overflow-hidden">
                    <span className={`font-medium truncate max-w-[100px] ${
                      route.transport_type === 'metro' ? 'text-purple-500' : 'text-blue-500'
                    }`}>
                      {route.stops[0]?.stop_name?.split(' ')[0]}
                    </span>
                    <span className="text-gray-300 mx-2">→</span>
                    {route.stops.length > 2 && (
                      <>
                        <span className="text-gray-400">{route.stops.length - 2} stops</span>
                        <span className="text-gray-300 mx-2">→</span>
                      </>
                    )}
                    <span className={`font-medium truncate max-w-[100px] ${
                      route.transport_type === 'metro' ? 'text-purple-500' : 'text-blue-500'
                    }`}>
                      {route.stops[route.stops.length - 1]?.stop_name?.split(' ')[0]}
                    </span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}