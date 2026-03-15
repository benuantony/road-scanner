import { useState, useEffect } from 'react';

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

// Transit Network Visualization - A stylized mini-map of Bangalore transit
const TransitNetworkVisualization = () => {
  const [activeVehicles, setActiveVehicles] = useState<number[]>([0, 1, 2]);
  const [activityFeed, setActivityFeed] = useState(0);

  // Rotate through vehicles for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVehicles(prev => prev.map(v => (v + 1) % 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Cycle through activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityFeed(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Transit hubs (nodes)
  const hubs = [
    { id: 'majestic', name: 'Majestic', x: 30, y: 45, major: true },
    { id: 'mgroad', name: 'MG Road', x: 50, y: 35, major: true },
    { id: 'indiranagar', name: 'Indiranagar', x: 65, y: 40, major: false },
    { id: 'whitefield', name: 'Whitefield', x: 85, y: 45, major: true },
    { id: 'krpuram', name: 'KR Puram', x: 75, y: 55, major: false },
    { id: 'silkboard', name: 'Silk Board', x: 55, y: 70, major: true },
    { id: 'ecity', name: 'Electronic City', x: 60, y: 85, major: true },
    { id: 'yeshwanthpur', name: 'Yeshwanthpur', x: 25, y: 25, major: false },
    { id: 'hebbal', name: 'Hebbal', x: 40, y: 15, major: false },
    { id: 'jayanagar', name: 'Jayanagar', x: 35, y: 65, major: false },
    { id: 'koramangala', name: 'Koramangala', x: 50, y: 55, major: false },
  ];

  // Route connections
  const routes = [
    // Purple Line (Metro)
    { from: 'yeshwanthpur', to: 'majestic', type: 'metro', color: 'purple' },
    { from: 'majestic', to: 'mgroad', type: 'metro', color: 'purple' },
    { from: 'mgroad', to: 'indiranagar', type: 'metro', color: 'purple' },
    { from: 'indiranagar', to: 'whitefield', type: 'metro', color: 'purple' },
    // Green Line (Metro)
    { from: 'hebbal', to: 'majestic', type: 'metro', color: 'green' },
    { from: 'majestic', to: 'jayanagar', type: 'metro', color: 'green' },
    // Bus routes
    { from: 'majestic', to: 'silkboard', type: 'bus', color: 'cyan' },
    { from: 'silkboard', to: 'ecity', type: 'bus', color: 'cyan' },
    { from: 'krpuram', to: 'whitefield', type: 'bus', color: 'cyan' },
    { from: 'mgroad', to: 'koramangala', type: 'bus', color: 'cyan' },
    { from: 'koramangala', to: 'silkboard', type: 'bus', color: 'cyan' },
    { from: 'indiranagar', to: 'krpuram', type: 'bus', color: 'cyan' },
  ];

  // Activity feed messages
  const activities = [
    { icon: '🚌', text: 'Bus 500A arriving at Majestic', time: 'Just now' },
    { icon: '🚇', text: 'Purple Line train at MG Road', time: '1m ago' },
    { icon: '🚌', text: 'Bus 335E departed Whitefield', time: '2m ago' },
    { icon: '🚇', text: 'Green Line train approaching Jayanagar', time: '3m ago' },
    { icon: '🚌', text: 'Bus 201R at Electronic City', time: '4m ago' },
  ];

  const getHubPosition = (hubId: string) => {
    const hub = hubs.find(h => h.id === hubId);
    return hub ? { x: hub.x, y: hub.y } : { x: 0, y: 0 };
  };

  return (
    <div className="relative bg-gray-900/80 backdrop-blur border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Transit Network Live</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Metro
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Bus
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Network Map */}
        <div className="flex-1 relative h-64 p-4">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines for effect */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(75, 85, 99, 0.2)" strokeWidth="0.3" />
              </pattern>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffff" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Route lines */}
            {routes.map((route, index) => {
              const from = getHubPosition(route.from);
              const to = getHubPosition(route.to);
              const gradient = route.color === 'purple' ? 'url(#purpleGradient)' : 
                              route.color === 'green' ? 'url(#greenGradient)' : 'url(#cyanGradient)';
              return (
                <line
                  key={index}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={gradient}
                  strokeWidth={route.type === 'metro' ? '1.5' : '1'}
                  strokeOpacity={0.6}
                  filter="url(#glow)"
                />
              );
            })}

            {/* Hub nodes */}
            {hubs.map((hub) => (
              <g key={hub.id}>
                {/* Outer glow ring for major hubs */}
                {hub.major && (
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r="4"
                    fill="none"
                    stroke="rgba(0, 255, 255, 0.3)"
                    strokeWidth="0.5"
                    className="animate-ping"
                    style={{ transformOrigin: `${hub.x}px ${hub.y}px`, animationDuration: '2s' }}
                  />
                )}
                {/* Hub dot */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={hub.major ? '2.5' : '1.5'}
                  fill={hub.major ? '#00ffff' : '#6b7280'}
                  filter={hub.major ? 'url(#glow)' : ''}
                />
              </g>
            ))}

            {/* Animated vehicles */}
            {routes.slice(0, 3).map((route, index) => {
              const from = getHubPosition(route.from);
              const to = getHubPosition(route.to);
              const progress = ((activeVehicles[index] || 0) % 10) / 10;
              const x = from.x + (to.x - from.x) * progress;
              const y = from.y + (to.y - from.y) * progress;
              
              return (
                <g key={`vehicle-${index}`}>
                  {/* Vehicle glow */}
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    fill={route.type === 'metro' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(0, 255, 255, 0.3)'}
                  />
                  {/* Vehicle dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill={route.type === 'metro' ? '#a855f7' : '#00ffff'}
                    filter="url(#glow)"
                  />
                </g>
              );
            })}
          </svg>

          {/* Hub labels (selected major ones) */}
          {hubs.filter(h => h.major).map((hub) => (
            <div
              key={`label-${hub.id}`}
              className="absolute text-[9px] text-gray-400 pointer-events-none whitespace-nowrap"
              style={{
                left: `${hub.x}%`,
                top: `${hub.y + 5}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {hub.name}
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="w-48 border-l border-gray-800 p-3">
          <div className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Live Activity</div>
          <div className="space-y-2">
            {activities.map((activity, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg transition-all duration-500 ${
                  index === activityFeed 
                    ? 'bg-cyan-500/10 border border-cyan-500/30' 
                    : 'bg-gray-800/30 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-sm">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs truncate ${index === activityFeed ? 'text-cyan-400' : 'text-gray-400'}`}>
                      {activity.text}
                    </div>
                    <div className="text-[10px] text-gray-600">{activity.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-gray-800 bg-gray-900/50">
        <div className="text-center">
          <div className="text-lg font-bold text-cyan-400">245+</div>
          <div className="text-[10px] text-gray-500">Buses Active</div>
        </div>
        <div className="w-px h-8 bg-gray-800"></div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">12</div>
          <div className="text-[10px] text-gray-500">Metro Trains</div>
        </div>
        <div className="w-px h-8 bg-gray-800"></div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">~45K</div>
          <div className="text-[10px] text-gray-500">In Transit Now</div>
        </div>
      </div>
    </div>
  );
};

export default function HeroSection() {
  const busRoutes = useAnimatedCounter(4200, 2000);
  const metroStations = useAnimatedCounter(56, 1500);
  const busStops = useAnimatedCounter(9000, 2500);
  const dailyRiders = useAnimatedCounter(45, 1800);

  const features = [
    {
      icon: '🗺️',
      title: 'Real-Time Tracking',
      description: 'Track buses and metro in real-time with live location updates',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
    },
    {
      icon: '🔍',
      title: 'Smart Route Search',
      description: 'Find the best route with multiple stop options and transfers',
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      icon: '⏱️',
      title: 'Live ETAs',
      description: 'Get accurate arrival times based on real traffic conditions',
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
    },
  ];

  const steps = [
    { number: '01', title: 'Enter Stops', desc: 'Select your start and end points', icon: '📍' },
    { number: '02', title: 'Find Routes', desc: 'Get all available bus & metro options', icon: '🔎' },
    { number: '03', title: 'Track Live', desc: 'See real-time vehicle locations', icon: '📡' },
  ];

  const popularRoutes = [
    { from: 'Majestic', to: 'Whitefield', type: 'bus', time: '45 min' },
    { from: 'MG Road', to: 'Silk Board', type: 'metro', time: '22 min' },
    { from: 'Yeshwanthpur', to: 'Electronic City', type: 'bus', time: '55 min' },
    { from: 'Indiranagar', to: 'Koramangala', type: 'bus', time: '15 min' },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-950">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/3 to-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center gap-4 mb-6">
            <span className="text-6xl animate-bounce" style={{ animationDelay: '0ms' }}>🚌</span>
            <span className="text-6xl animate-bounce" style={{ animationDelay: '150ms' }}>🚇</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Bangalore Transit
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your complete guide to BMTC buses and Namma Metro. 
            Search routes, track vehicles in real-time, and never miss your ride.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4 text-center hover:border-cyan-500/30 transition-colors">
            <div className="text-3xl font-bold text-cyan-400 glow-text-cyan">{busRoutes.toLocaleString()}+</div>
            <div className="text-gray-400 text-sm">Bus Routes</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4 text-center hover:border-purple-500/30 transition-colors">
            <div className="text-3xl font-bold text-purple-400 glow-text-purple">{metroStations}</div>
            <div className="text-gray-400 text-sm">Metro Stations</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4 text-center hover:border-cyan-500/30 transition-colors">
            <div className="text-3xl font-bold text-cyan-400 glow-text-cyan">{busStops.toLocaleString()}+</div>
            <div className="text-gray-400 text-sm">Bus Stops</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4 text-center hover:border-green-500/30 transition-colors">
            <div className="text-3xl font-bold text-green-400">{dailyRiders}L+</div>
            <div className="text-gray-400 text-sm">Daily Riders</div>
          </div>
        </div>

        {/* Transit Network Visualization */}
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <TransitNetworkVisualization />
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-gradient-to-br ${feature.gradient} backdrop-blur border ${feature.borderColor} rounded-xl p-5 hover:scale-105 transition-transform duration-300`}
              style={{ animationDelay: `${500 + index * 100}ms` }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <h2 className="text-2xl font-bold text-center text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-cyan-500/50 to-transparent" />
                )}
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5 text-center hover:border-cyan-500/30 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <div className="text-cyan-400 text-xs font-mono mb-1">STEP {step.number}</div>
                  <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Routes */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔥</span> Popular Routes
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-900/30 border border-gray-800 rounded-lg p-4 hover:border-cyan-500/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{route.type === 'bus' ? '🚌' : '🚇'}</span>
                  <div>
                    <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                      {route.from} → {route.to}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {route.type === 'bus' ? 'BMTC Bus' : 'Namma Metro'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-medium">{route.time}</div>
                  <div className="text-gray-500 text-xs">avg. travel time</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-6 animate-slide-up" style={{ animationDelay: '700ms' }}>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span>💡</span> Quick Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">•</span>
              <span className="text-gray-400">Use the search bar above to find routes between any two stops</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">•</span>
              <span className="text-gray-400">Add intermediate stops to customize your journey</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">•</span>
              <span className="text-gray-400">Click on a route to see detailed stop-by-stop timeline</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">•</span>
              <span className="text-gray-400">Green dot indicator means you're connected to live tracking</span>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}