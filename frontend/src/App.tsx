import { useState, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import RouteMap from './components/RouteMap';
import RouteList from './components/RouteList';
import RouteTimeline from './components/RouteTimeline';
import AdminPanel from './components/AdminPanel';
import HeroSection from './components/HeroSection';
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
  const [focusedStop, setFocusedStop] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(0);
  const [timelineCollapseState, setTimelineCollapseState] = useState<'expanded' | 'mini' | 'collapsed'>('expanded');

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
    setFocusedStop(null);
  };

  const handleStopSelect = (_stopIndex: number, latitude: number, longitude: number) => {
    setFocusedStop({ latitude, longitude });
  };

  const handleCurrentStopChange = (index: number) => {
    setCurrentStopIndex(index);
  };

  // Handler for when bus icon on map is clicked
  const handleBusClick = () => {
    // Set to mini state when bus is clicked on map
    setTimelineCollapseState('mini');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-950">
      {/* Header - Fixed height */}
      <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 py-2 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xl">🚌</span>
            <span className="text-xl">🚇</span>
          </div>
          <div>
            <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-sm">Bangalore Transit</h1>
            <p className="text-gray-500 text-xs">Bus & Metro</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
            title="Admin Panel"
          >
            ⚙️
          </button>
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
            isConnected ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-500 border border-gray-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
            <span>{isConnected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      </header>

      {/* Search Bar - Fixed height, high z-index for dropdown to appear above content */}
      <div className="flex-shrink-0 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-4 py-3 relative z-[100]">
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content - Takes remaining space */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {!hasSearched ? (
          /* Hero Section - Rich Welcome Screen */
          <HeroSection />
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
                    focusedStop={focusedStop}
                    currentStopIndex={currentStopIndex}
                    onBusClick={handleBusClick}
                  />
                </div>
              </div>

              {/* Route List - Fixed width, scrollable */}
              <div className="w-72 flex-shrink-0 border-l border-gray-800 bg-gray-900 flex flex-col min-h-0">
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
              <div className="flex-shrink-0 overflow-hidden">
                <RouteTimeline
                  route={selectedRoute}
                  vehicles={filteredVehicles}
                  isConnected={isConnected}
                  onClose={handleCloseTimeline}
                  onStopSelect={handleStopSelect}
                  onCurrentStopChange={handleCurrentStopChange}
                  collapseState={timelineCollapseState}
                  onCollapseStateChange={setTimelineCollapseState}
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