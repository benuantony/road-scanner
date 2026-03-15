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

// GTFS Import Types
export interface GTFSSource {
  id: string;
  name: string;
  url: string;
}

export interface GTFSStatus {
  status: string;
  data: {
    stops: number;
    routes: number;
    route_stops: number;
  };
  available_sources: Record<string, string>;
}

export interface GTFSImportResult {
  success: boolean;
  source: string;
  imported_at: string;
  stats: {
    stops: number;
    routes: number;
    route_stops: number;
  };
  error?: string;
  message?: string;
}

// GTFS Import API
export const gtfsApi = {
  // Get current data status
  getStatus: async (): Promise<GTFSStatus> => {
    const response = await fetch(`${API_BASE}/gtfs/status`);
    if (!response.ok) throw new Error('Failed to get GTFS status');
    return response.json();
  },

  // Get available GTFS sources
  getSources: async (): Promise<{ sources: GTFSSource[] }> => {
    const response = await fetch(`${API_BASE}/gtfs/sources`);
    if (!response.ok) throw new Error('Failed to get GTFS sources');
    return response.json();
  },

  // Import GTFS data from URL or predefined source
  import: async (urlOrSource: string, isSource = false): Promise<GTFSImportResult> => {
    const body = isSource ? { source: urlOrSource } : { url: urlOrSource };
    
    const response = await fetch(`${API_BASE}/gtfs/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to import GTFS');
    }
    return result;
  },

  // Clear all data
  clearData: async (): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE}/gtfs/data`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear data');
    return response.json();
  },
};
