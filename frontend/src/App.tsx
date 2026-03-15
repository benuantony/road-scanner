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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header - Always visible */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚌</span>
            <span className="text-2xl">🚇</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">
              Bangalore Transit
            </h1>
            <p className="text-gray-500 text-xs">Bus & Metro Routes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Admin Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all"
            title="Admin Panel - Import GTFS Data"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Admin</span>
          </button>
          {/* Live Status */}
          <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
            isConnected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span>{isConnected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="container mx-auto max-w-6xl">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {!hasSearched ? (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="text-center max-w-2xl">
              <div className="flex justify-center gap-4 mb-6">
                <span className="text-6xl animate-bounce" style={{ animationDelay: '0ms' }}>🚌</span>
                <span className="text-6xl animate-bounce" style={{ animationDelay: '100ms' }}>🚇</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Find Your Route in Bangalore
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Search for BMTC bus and Namma Metro routes. Get live tracking, ETA, and route details.
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="text-3xl mb-2">🚏</div>
                  <p className="font-semibold text-gray-800">9,000+</p>
                  <p className="text-gray-500">Bus Stops</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="text-3xl mb-2">🛤️</div>
                  <p className="font-semibold text-gray-800">4,000+</p>
                  <p className="text-gray-500">Routes</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="text-3xl mb-2">📍</div>
                  <p className="font-semibold text-green-600">Live</p>
                  <p className="text-gray-500">Tracking</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="flex-1 flex flex-col">
            {/* Map and Route List */}
            <div className="flex-1 flex min-h-0">
              {/* Map - Takes most of the space */}
              <div className="flex-1 relative">
                <RouteMap
                  selectedRoute={selectedRoute}
                  vehicles={filteredVehicles}
                  allRoutes={routes}
                />
              </div>

              {/* Route List - Right sidebar */}
              <div className="w-80 border-l border-gray-200 bg-white overflow-hidden flex flex-col">
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

            {/* Route Timeline - Bottom panel when route is selected */}
            {selectedRoute && (
              <RouteTimeline
                route={selectedRoute}
                vehicles={filteredVehicles}
                isConnected={isConnected}
                onClose={handleCloseTimeline}
              />
            )}

            {/* No results message */}
            {!isLoading && routes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4 border border-gray-100">
                  <span className="text-5xl mb-4 block">🔍</span>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No routes found
                  </h3>
                  <p className="text-gray-500">
                    Try searching with different stops. Make sure both stops are on the same bus or metro line.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer - Only on welcome screen */}
      {!hasSearched && (
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p>
              <span className="font-semibold text-gray-700">Bangalore Transit</span>
              {' '}- BMTC Bus & Namma Metro Route Finder
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Built with React, Node.js, PostgreSQL & OpenStreetMap
            </p>
          </div>
        </footer>
      )}

      {/* Admin Panel Modal */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}

export default App;