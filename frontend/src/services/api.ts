import { Stop, Route, Vehicle } from '../types';

const API_BASE = '/api';

// Stops API
export const stopsApi = {
  search: async (query: string, type?: string, limit = 10): Promise<Stop[]> => {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    if (type) params.append('type', type);
    
    const response = await fetch(`${API_BASE}/stops/search?${params}`);
    if (!response.ok) throw new Error('Failed to search stops');
    return response.json();
  },

  getAll: async (type?: string): Promise<Stop[]> => {
    const params = type ? `?type=${type}` : '';
    const response = await fetch(`${API_BASE}/stops${params}`);
    if (!response.ok) throw new Error('Failed to fetch stops');
    return response.json();
  },

  getById: async (id: number): Promise<Stop> => {
    const response = await fetch(`${API_BASE}/stops/${id}`);
    if (!response.ok) throw new Error('Failed to fetch stop');
    return response.json();
  },
};

// Routes API
export const routesApi = {
  find: async (
    from: number,
    to: number,
    stops?: number[],
    type?: string
  ): Promise<Route[]> => {
    const params = new URLSearchParams({
      from: String(from),
      to: String(to),
    });
    if (stops && stops.length > 0) {
      params.append('stops', stops.join(','));
    }
    if (type) params.append('type', type);

    const response = await fetch(`${API_BASE}/routes/find?${params}`);
    if (!response.ok) throw new Error('Failed to find routes');
    return response.json();
  },

  getAll: async (type?: string): Promise<Route[]> => {
    const params = type ? `?type=${type}` : '';
    const response = await fetch(`${API_BASE}/routes${params}`);
    if (!response.ok) throw new Error('Failed to fetch routes');
    return response.json();
  },

  getById: async (id: number): Promise<Route> => {
    const response = await fetch(`${API_BASE}/routes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch route');
    return response.json();
  },

  getVehicles: async (routeId: number): Promise<Vehicle[]> => {
    const response = await fetch(`${API_BASE}/routes/${routeId}/vehicles`);
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
  },
};

// Vehicles API
export const vehiclesApi = {
  getAll: async (type?: string, status = 'running'): Promise<Vehicle[]> => {
    const params = new URLSearchParams({ status });
    if (type) params.append('type', type);

    const response = await fetch(`${API_BASE}/vehicles?${params}`);
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
  },

  getById: async (id: number): Promise<Vehicle> => {
    const response = await fetch(`${API_BASE}/vehicles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle');
    return response.json();
  },
};