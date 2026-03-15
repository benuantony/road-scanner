// Stop type
export interface Stop {
  id: number;
  name: string;
  name_tamil?: string;
  latitude: number;
  longitude: number;
  district: string;
  stop_type: 'bus' | 'train' | 'metro' | 'both';
}

// Route stop (stop within a route)
export interface RouteStop {
  stop_id: number;
  stop_name: string;
  stop_tamil?: string;
  latitude: number;
  longitude: number;
  sequence: number;
  distance: number;
  time_offset: number;
  arrival_offset?: number; // ETA in minutes from route start
}

// Route type
export interface Route {
  id: number;
  route_number: string;
  route_name: string;
  transport_type: 'bus' | 'train' | 'metro';
  operator: string;
  frequency_mins?: number;
  stops: RouteStop[];
  total_distance?: number;
  total_time?: number;
}

// Vehicle type
export interface Vehicle {
  id: number;
  vehicle_number: string;
  transport_type: 'bus' | 'train' | 'metro';
  status: 'running' | 'stopped' | 'delayed' | 'completed';
  progress_percent: number;
  current_latitude: number;
  current_longitude: number;
  last_updated: string;
  current_stop_name: string;
  current_stop_id: number;
  next_stop_name?: string;
  next_stop_id?: number;
  route_id: number;
  route_number: string;
  route_name: string;
}

// Search result
export interface SearchResult {
  routes: Route[];
  from: Stop;
  to: Stop;
  intermediateStops?: Stop[];
}

// WebSocket message types
export interface WSMessage {
  type: 'connected' | 'subscribed' | 'vehicleUpdate';
  message?: string;
  routeIds?: number[];
  timestamp?: string;
  vehicles?: Vehicle[];
}

// API Response types
export interface ApiError {
  error: string;
}