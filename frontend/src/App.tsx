import { useState, useMemo } from 'react';
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
  const [hasSearched, setHasSearched] = useState(false);

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
    setHasSearched(true); // This triggers the hero collapse - one way, never expands again
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section - Collapses after first search */}
      <div 
        className={`relative transition-all duration-700 ease-in-out overflow-hidden ${
          hasSearched ? 'h-20' : 'h-[55vh] min-h-[400px]'
        }`}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-800/70 to-blue-900/90" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col">
          {/* Header - Always visible */}
          <header className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚌</span>
              <div>
                <h1 className={`font-bold text-white transition-all duration-500 ${
                  hasSearched ? 'text-lg' : 'text-xl'
                }`}>
                  Tamil Nadu Bus Finder
                </h1>
                {!hasSearched && (
                  <p className="text-blue-200 text-sm">Find bus routes across Tamil Nadu</p>
                )}
              </div>
            </div>
            {hasSearched && (
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
            )}
          </header>

          {/* Centered Content - Only visible before search */}
          {!hasSearched && (
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
              <div className="text-center mb-8 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Where do you want to go?
                </h2>
                <p className="text-lg text-blue-100 max-w-xl mx-auto">
                  Search bus routes connecting Chennai, Coimbatore, Nagercoil and 80+ cities across Tamil Nadu
                </p>
              </div>
              
              {/* Search Bar - Centered in Hero */}
              <div className="w-full max-w-4xl animate-slide-up">
                <SearchBar onSearch={handleSearch} />
              </div>

              {/* Stats */}
              <div className="mt-8 flex items-center gap-8 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚏</span>
                  <div>
                    <p className="font-semibold text-white">80+</p>
                    <p>Bus Stops</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛤️</span>
                  <div>
                    <p className="font-semibold text-white">20+</p>
                    <p>Routes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-white">Live</p>
                    <p>Tracking</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar - Below collapsed header after search */}
      {hasSearched && (
        <div className="bg-white shadow-md border-b border-gray-200 px-4 py-4 animate-fade-in">
          <div className="container mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      )}

      {/* Main Content - Only visible after search */}
      {hasSearched && (
        <main className="flex-1 container mx-auto px-4 py-6 animate-fade-in">
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
          {(routes.length > 0 || vehicles.length > 0) && (
            <LiveTracker
              vehicles={filteredVehicles}
              selectedRoute={selectedRoute}
              isConnected={isConnected}
            />
          )}

          {/* No results message */}
          {!isLoading && routes.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="max-w-md mx-auto">
                <span className="text-5xl mb-4 block">🔍</span>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No routes found
                </h3>
                <p className="text-gray-500">
                  Try searching with different origin and destination stops.
                  We currently cover routes connecting Chennai, Coimbatore, Nagercoil and surrounding areas.
                </p>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className={`bg-gray-800 text-gray-400 py-4 mt-auto ${!hasSearched ? 'absolute bottom-0 w-full' : ''}`}>
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Tamil Nadu Bus Finder - Real-time Bus Routes & Tracking</p>
          <p className="mt-1 text-gray-500">
            Built with React, Node.js, PostgreSQL & OpenStreetMap
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;