import { useState, useEffect, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import RouteMap from './components/RouteMap';
import RouteList from './components/RouteList';
import LiveTracker from './components/LiveTracker';
import { useVehicleTracking } from './hooks/useVehicleTracking';
import { routesApi } from './services/api';
import { Stop, Route } from './types';

function App() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

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
    setSearchPerformed(true);
    setSelectedRoute(null);

    try {
      const stopIds = intermediateStops.map((s) => s.id);
      const foundRoutes = await routesApi.find(from.id, to.id, stopIds);
      setRoutes(foundRoutes);
      
      // Auto-select first route if only one found
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚌</span>
              <div>
                <h1 className="text-xl font-bold">Tamil Nadu Transport Finder</h1>
                <p className="text-blue-200 text-sm">Bus & Train Routes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  Bus
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                  Train
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Map and Route List */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-6">
          {/* Map - 70% */}
          <div className="lg:col-span-7 h-[500px] bg-white rounded-xl shadow-md overflow-hidden">
            <RouteMap
              selectedRoute={selectedRoute}
              vehicles={filteredVehicles}
              allRoutes={routes}
            />
          </div>

          {/* Route List - 30% */}
          <div className="lg:col-span-3 h-[500px] bg-white rounded-xl shadow-md overflow-hidden">
            <RouteList
              routes={routes}
              selectedRoute={selectedRoute}
              onSelectRoute={handleSelectRoute}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Live Tracker */}
        {(searchPerformed || vehicles.length > 0) && (
          <LiveTracker
            vehicles={filteredVehicles}
            selectedRoute={selectedRoute}
            isConnected={isConnected}
          />
        )}

        {/* Initial state message */}
        {!searchPerformed && vehicles.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center gap-4 text-5xl mb-4">
                <span>🚌</span>
                <span>🚃</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Find Your Route
              </h2>
              <p className="text-gray-500">
                Search for bus and train routes across Tamil Nadu. Enter your origin
                and destination to find available routes, view them on the map, and
                track vehicles in real-time.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">40+</p>
                  <p className="text-gray-500">Stops</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">15+</p>
                  <p className="text-gray-500">Routes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">Live</p>
                  <p className="text-gray-500">Tracking</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Tamil Nadu Transport Finder - Bus & Train Routes</p>
          <p className="mt-1">
            Built with React, Node.js, PostgreSQL & OpenStreetMap
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;