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
  // Filter routes by transport type - explicit comparison
  const filteredRoutes = transportFilter === 'all' 
    ? routes 
    : routes.filter(r => {
        const type = r.transport_type?.toLowerCase();
        return type === transportFilter;
      });

  // Count by type
  const busCount = routes.filter(r => r.transport_type?.toLowerCase() === 'bus').length;
  const metroCount = routes.filter(r => r.transport_type?.toLowerCase() === 'metro').length;

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
      <div className="h-full flex flex-col bg-white">
        <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
          <h3 className="font-semibold text-gray-800">Route Search</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
            <h4 className="text-base font-semibold text-gray-800 mb-2">
              No Direct Routes
            </h4>
            <p className="text-gray-500 text-sm mb-4">
              No direct route found between these stops.
            </p>
            
            <div className="text-left bg-blue-50 rounded-lg p-3 text-xs">
              <p className="font-semibold text-blue-700 mb-1">💡 Tips</p>
              <ul className="text-blue-600 space-y-1">
                <li>• Try nearby stops</li>
                <li>• Use metro stations</li>
                <li>• May need transfer</li>
              </ul>
            </div>
          </div>
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
    const type = route.transport_type?.toLowerCase();
    if (type === 'metro') {
      return <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">Metro</span>;
    }
    if (route.operator?.includes('Volvo')) {
      return <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">Volvo AC</span>;
    }
    if (route.operator?.includes('Vajra')) {
      return <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-orange-100 text-orange-700">Vajra</span>;
    }
    return <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">Regular</span>;
  };

  // Get icon based on transport type and operator
  const getTransportIcon = (route: Route) => {
    const type = route.transport_type?.toLowerCase();
    if (type === 'metro') {
      return '🚇'; // Metro
    }
    if (route.operator?.includes('Volvo')) {
      return '🚎'; // Trolleybus/AC Bus for Volvo
    }
    if (route.operator?.includes('Vajra')) {
      return '🚐'; // Minibus for Airport/Vajra
    }
    return '🚌'; // Regular bus
  };

  // Get operator color class
  const getOperatorColorClass = (route: Route, isSelected: boolean) => {
    const type = route.transport_type?.toLowerCase();
    if (type === 'metro') {
      return isSelected ? 'bg-purple-100' : 'bg-purple-50';
    }
    if (route.operator?.includes('Volvo')) {
      return isSelected ? 'bg-blue-100' : 'bg-blue-50';
    }
    if (route.operator?.includes('Vajra')) {
      return isSelected ? 'bg-orange-100' : 'bg-orange-50';
    }
    return isSelected ? 'bg-green-100' : 'bg-green-50';
  };

  // Get border color class
  const getBorderColorClass = (route: Route) => {
    const type = route.transport_type?.toLowerCase();
    if (type === 'metro') {
      return 'border-purple-500';
    }
    if (route.operator?.includes('Volvo')) {
      return 'border-blue-500';
    }
    if (route.operator?.includes('Vajra')) {
      return 'border-orange-500';
    }
    return 'border-green-500';
  };

  // Get text color class
  const getTextColorClass = (route: Route) => {
    const type = route.transport_type?.toLowerCase();
    if (type === 'metro') {
      return 'text-purple-600';
    }
    if (route.operator?.includes('Volvo')) {
      return 'text-blue-600';
    }
    if (route.operator?.includes('Vajra')) {
      return 'text-orange-600';
    }
    return 'text-green-600';
  };

  const isMetroRoute = (route: Route) => route.transport_type?.toLowerCase() === 'metro';

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Filter - Fixed */}
      <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-sm">
            Routes Found
          </h3>
          <span className="text-xs text-gray-400">({filteredRoutes.length})</span>
        </div>
        
        {/* Transport Type Filter */}
        {onTransportFilterChange && (
          <div className="flex gap-1">
            <button
              onClick={() => onTransportFilterChange('all')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                transportFilter === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({routes.length})
            </button>
            <button
              onClick={() => onTransportFilterChange('bus')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                transportFilter === 'bus'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              🚌 ({busCount})
            </button>
            <button
              onClick={() => onTransportFilterChange('metro')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                transportFilter === 'metro'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              🚇 ({metroCount})
            </button>
          </div>
        )}
      </div>

      {/* Routes List - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredRoutes.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <span className="text-2xl block mb-2">
              {transportFilter === 'metro' ? '🚇' : '🚌'}
            </span>
            <p className="text-sm">No {transportFilter} routes</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRoutes.map((route) => {
              const isSelected = selectedRoute?.id === route.id;
              const bgClass = isSelected ? getOperatorColorClass(route, true).replace('bg-', 'bg-').replace('100', '50') : '';
              const borderClass = isSelected ? getBorderColorClass(route) : 'border-transparent';

              return (
                <button
                  key={route.id}
                  onClick={() => onSelectRoute(route)}
                  className={`w-full p-3 text-left transition-all border-l-4 ${borderClass} ${
                    isSelected ? getOperatorColorClass(route, false) : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Transport Icon */}
                    <div className={`text-lg p-1.5 rounded ${getOperatorColorClass(route, isSelected)}`}>
                      {getTransportIcon(route)}
                    </div>
                    
                    {/* Route Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-sm ${
                          isSelected ? getTextColorClass(route) : 'text-gray-800'
                        }`}>
                          {route.route_number}
                        </span>
                        {getOperatorBadge(route)}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {route.route_name}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                        <span>🚏 {route.stops?.length || 0}</span>
                        {route.total_time && route.total_time > 0 && (
                          <span>⏱️ {formatDuration(route.total_time)}</span>
                        )}
                      </div>
                    </div>

                    {/* Selection Indicator - Color matches operator */}
                    {isSelected && (
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        route.transport_type?.toLowerCase() === 'metro' ? 'bg-purple-500' :
                        route.operator?.includes('Volvo') ? 'bg-blue-500' :
                        route.operator?.includes('Vajra') ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}>
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}