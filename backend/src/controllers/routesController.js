const db = require('../config/database');

// Find routes between two stops (with optional intermediate stops)
// Now supports proximity-based search to find both bus and metro routes
const findRoutes = async (req, res) => {
  try {
    const { from, to, stops: intermediateStops, type } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'From and To stops are required' });
    }

    const fromId = parseInt(from);
    const toId = parseInt(to);

    // First, get the coordinates of the from and to stops
    const stopsResult = await db.query(`
      SELECT id, name, latitude, longitude, stop_type 
      FROM stops 
      WHERE id IN ($1, $2)
    `, [fromId, toId]);

    if (stopsResult.rows.length < 2) {
      return res.status(400).json({ error: 'Invalid stop IDs' });
    }

    const fromStop = stopsResult.rows.find(s => s.id === fromId);
    const toStop = stopsResult.rows.find(s => s.id === toId);

    // Find routes that pass through the exact stops OR nearby stops (within ~500m)
    // Using Haversine approximation: 0.005 degrees ≈ 500m
    const PROXIMITY = 0.005;

    let query = `
      WITH nearby_from_stops AS (
        SELECT DISTINCT s.id
        FROM stops s
        WHERE (s.id = $1)
           OR (ABS(s.latitude - $2) < $5 AND ABS(s.longitude - $3) < $5)
      ),
      nearby_to_stops AS (
        SELECT DISTINCT s.id
        FROM stops s
        WHERE (s.id = $4)
           OR (ABS(s.latitude - $6) < $5 AND ABS(s.longitude - $7) < $5)
      ),
      matching_routes AS (
        SELECT DISTINCT rs1.route_id, rs1.stop_id as from_stop_id, rs2.stop_id as to_stop_id
        FROM route_stops rs1
        JOIN route_stops rs2 ON rs1.route_id = rs2.route_id
        WHERE rs1.stop_id IN (SELECT id FROM nearby_from_stops)
          AND rs2.stop_id IN (SELECT id FROM nearby_to_stops)
          AND rs2.stop_sequence > rs1.stop_sequence
      )
      SELECT 
        r.id,
        r.route_number,
        r.route_name,
        r.transport_type,
        r.operator,
        r.frequency_mins,
        mr.from_stop_id,
        mr.to_stop_id,
        json_agg(
          json_build_object(
            'stop_id', rs.stop_id,
            'stop_name', s.name,
            'stop_tamil', s.name_tamil,
            'latitude', s.latitude,
            'longitude', s.longitude,
            'sequence', rs.stop_sequence,
            'distance', rs.distance_from_start,
            'time_offset', rs.arrival_offset_mins,
            'arrival_offset', rs.arrival_offset_mins
          ) ORDER BY rs.stop_sequence
        ) as stops
      FROM routes r
      JOIN matching_routes mr ON r.id = mr.route_id
      JOIN route_stops rs ON r.id = rs.route_id
      JOIN stops s ON rs.stop_id = s.id
    `;

    const params = [
      fromId,                    // $1
      fromStop.latitude,         // $2
      fromStop.longitude,        // $3
      toId,                      // $4
      PROXIMITY,                 // $5
      toStop.latitude,           // $6
      toStop.longitude,          // $7
    ];

    // Filter by transport type if specified
    if (type && ['bus', 'metro', 'train'].includes(type)) {
      params.push(type);
      query += ` WHERE r.transport_type = $${params.length}`;
    }

    query += `
      GROUP BY r.id, mr.from_stop_id, mr.to_stop_id
      ORDER BY r.transport_type, r.route_number
    `;

    const result = await db.query(query, params);

    // Filter stops to only include from origin to destination
    const routes = result.rows.map(route => {
      const fromIndex = route.stops.findIndex(s => s.stop_id === route.from_stop_id);
      const toIndex = route.stops.findIndex(s => s.stop_id === route.to_stop_id);
      
      const filteredStops = route.stops.slice(
        Math.max(0, fromIndex), 
        Math.min(route.stops.length, toIndex + 1)
      );

      return {
        id: route.id,
        route_number: route.route_number,
        route_name: route.route_name,
        transport_type: route.transport_type,
        operator: route.operator,
        frequency_mins: route.frequency_mins,
        stops: filteredStops,
        total_distance: filteredStops.length > 1 
          ? (filteredStops[filteredStops.length - 1]?.distance || 0) - (filteredStops[0]?.distance || 0)
          : 0,
        total_time: filteredStops.length > 1 
          ? (filteredStops[filteredStops.length - 1]?.time_offset || 0) - (filteredStops[0]?.time_offset || 0)
          : 0,
      };
    });

    res.json(routes);
  } catch (error) {
    console.error('Error finding routes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get route by ID with all stops
const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        r.id,
        r.route_number,
        r.route_name,
        r.transport_type,
        r.operator,
        r.frequency_mins,
        json_agg(
          json_build_object(
            'stop_id', rs.stop_id,
            'stop_name', s.name,
            'stop_tamil', s.name_tamil,
            'latitude', s.latitude,
            'longitude', s.longitude,
            'sequence', rs.stop_sequence,
            'distance', rs.distance_from_start,
            'time_offset', rs.arrival_offset_mins
          ) ORDER BY rs.stop_sequence
        ) as stops
      FROM routes r
      JOIN route_stops rs ON r.id = rs.route_id
      JOIN stops s ON rs.stop_id = s.id
      WHERE r.id = $1
      GROUP BY r.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all routes
const getAllRoutes = async (req, res) => {
  try {
    const { type } = req.query;

    let query = `
      SELECT 
        r.id,
        r.route_number,
        r.route_name,
        r.transport_type,
        r.operator,
        r.frequency_mins
      FROM routes r
    `;
    const params = [];

    if (type && ['bus', 'metro', 'train'].includes(type)) {
      query += ' WHERE r.transport_type = $1';
      params.push(type);
    }

    query += ' ORDER BY r.route_number';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  findRoutes,
  getRouteById,
  getAllRoutes,
};