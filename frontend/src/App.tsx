import { useState, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import RouteMap from './components/RouteMap';
import RouteList from './components/RouteList';
import RouteTimeline from './components/RouteTimeline';
import AdminPanel from './components/AdminPanel';
import { useVehicleTracking } from './hooks/useVehicleTracking';
import { routesApi } from './services/api';
import { Stop, Route } from './types';

function App() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [transportFilter, setTransportFilter] = useState<'all' | 'bus' | 'metro'>('all');

  // Get route IDs for WebSocket subscription
  const routeIds = useMemo(() => {
    if (selectedRoute) return [selectedRoute.id];
    return routes.map((r) => r.id);
  }, [selectedRoute, routes]);

  // Live vehicle tracking
  const { vehicles, isConnected } = useVehicleTracking({
    routeIds: routeIds.length > 0 ? routeIds : undefined,
    autoConnect: true,
  });

  // Filter vehicles for selected route
  const filteredVehicles = useMemo(() => {
    if (!selectedRoute) return vehicles;
    return vehicles.filter((v) => v.route_id === selectedRoute.id);
  }, [vehicles, selectedRoute]);

  const handleSearch = async (from: Stop, to: Stop, intermediateStops: Stop[]) => {
    setIsLoading(true);
    setHasSearched(true);
    setSelectedRoute(null);

    try {
      const stopIds = intermediateStops.map((s) => s.id);
      const foundRoutes = await routesApi.find(from.id, to.id, stopIds);
      setRoutes(foundRoutes);
      
      if (foundRoutes.length === 1) {
        setSelectedRoute(foundRoutes[0]);
      }
    } catch (error) {
      console.error('Error finding routes:', error);
      setRoutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRoute = (route: Route) => {
    setSelectedRoute(route);
  };

  const handleCloseTimeline = () => {
    setSelectedRoute(null);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Header - Fixed height */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xl">🚌</span>
            <span className="text-xl">🚇</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm">Bangalore Transit</h1>
            <p className="text-gray-400 text-xs">Bus & Metro</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200 hover:border-blue-300 hover:text-blue-600"
            title="Admin Panel"
          >
            ⚙️
          </button>
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
            isConnected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span>{isConnected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      </header>

      {/* Search Bar - Fixed height */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content - Takes remaining space */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {!hasSearched ? (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-8 overflow-auto">
            <div className="text-center max-w-xl">
              <div className="flex justify-center gap-3 mb-4">
                <span className="text-5xl animate-bounce" style={{ animationDelay: '0ms' }}>🚌</span>
                <span className="text-5xl animate-bounce" style={{ animationDelay: '100ms' }}>🚇</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Find Your Route
              </h2>
              <p className="text-gray-600 mb-6">
                Search BMTC bus and Namma Metro routes with live tracking.
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
                  <div className="text-2xl mb-1">🚏</div>
                  <p className="font-semibold text-gray-800">9,000+</p>
                  <p className="text-gray-400 text-xs">Stops</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
                  <div className="text-2xl mb-1">🛤️</div>
                  <p className="font-semibold text-gray-800">4,000+</p>
                  <p className="text-gray-400 text-xs">Routes</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
                  <div className="text-2xl mb-1">📍</div>
                  <p className="font-semibold text-green-600">Live</p>
                  <p className="text-gray-400 text-xs">Tracking</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results View - Fixed height layout */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Map and Route List row */}
            <div className="flex-1 flex min-h-0">
              {/* Map container - fixed aspect */}
              <div className="flex-1 min-w-0 relative">
                <div className="absolute inset-0">
                  <RouteMap
                    selectedRoute={selectedRoute}
                    vehicles={filteredVehicles}
                    allRoutes={routes}
                  />
                </div>
              </div>

              {/* Route List - Fixed width, scrollable */}
              <div className="w-72 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-hidden">
                  <RouteList
                    routes={routes}
                    selectedRoute={selectedRoute}
                    onSelectRoute={handleSelectRoute}
                    isLoading={isLoading}
                    transportFilter={transportFilter}
                    onTransportFilterChange={setTransportFilter}
                  />
                </div>
              </div>
            </div>

            {/* Route Timeline - Fixed height at bottom */}
            {selectedRoute && (
              <div className="flex-shrink-0 max-h-[40vh] overflow-hidden">
                <RouteTimeline
                  route={selectedRoute}
                  vehicles={filteredVehicles}
                  isConnected={isConnected}
                  onClose={handleCloseTimeline}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Admin Panel Modal */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}

export default App;