const db = require('../config/database');

// Find routes between two stops (with optional intermediate stops)
const findRoutes = async (req, res) => {
  try {
    const { from, to, stops: intermediateStops, type } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'From and To stops are required' });
    }

    // Parse intermediate stops if provided
    const stopIds = intermediateStops ? intermediateStops.split(',').map(Number) : [];
    const allStopIds = [parseInt(from), ...stopIds, parseInt(to)];

    // Find routes that pass through all specified stops in order
    let query = `
      WITH route_with_stops AS (
        SELECT 
          r.id as route_id,
          r.route_number,
          r.route_name,
          r.transport_type,
          r.operator,
          rs.stop_id,
          rs.stop_sequence,
          rs.distance_from_start,
          rs.arrival_offset_mins
        FROM routes r
        JOIN route_stops rs ON r.id = rs.route_id
      ),
      matching_routes AS (
        SELECT DISTINCT route_id
        FROM route_with_stops rws1
        WHERE rws1.stop_id = $1
        AND EXISTS (
          SELECT 1 FROM route_with_stops rws2 
          WHERE rws2.route_id = rws1.route_id 
          AND rws2.stop_id = $2 
          AND rws2.stop_sequence > rws1.stop_sequence
        )
    `;

    const params = [parseInt(from), parseInt(to)];

    // Add intermediate stop checks
    stopIds.forEach((stopId, index) => {
      const prevStopId = index === 0 ? parseInt(from) : stopIds[index - 1];
      params.push(stopId, prevStopId);
      query += `
        AND EXISTS (
          SELECT 1 FROM route_with_stops rws${index + 3}
          WHERE rws${index + 3}.route_id = rws1.route_id
          AND rws${index + 3}.stop_id = $${params.length - 1}
          AND rws${index + 3}.stop_sequence > (
            SELECT stop_sequence FROM route_with_stops 
            WHERE route_id = rws1.route_id AND stop_id = $${params.length}
          )
        )
      `;
    });

    query += `)`;

    // Filter by transport type if specified
    if (type && ['bus', 'train'].includes(type)) {
      params.push(type);
      query += `
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
        JOIN matching_routes mr ON r.id = mr.route_id
        JOIN route_stops rs ON r.id = rs.route_id
        JOIN stops s ON rs.stop_id = s.id
        WHERE r.transport_type = $${params.length}
        GROUP BY r.id
        ORDER BY r.route_number
      `;
    } else {
      query += `
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
        JOIN matching_routes mr ON r.id = mr.route_id
        JOIN route_stops rs ON r.id = rs.route_id
        JOIN stops s ON rs.stop_id = s.id
        GROUP BY r.id
        ORDER BY r.route_number
      `;
    }

    const result = await db.query(query, params);

    // Filter stops to only include from origin to destination
    const routes = result.rows.map(route => {
      const fromIndex = route.stops.findIndex(s => s.stop_id === parseInt(from));
      const toIndex = route.stops.findIndex(s => s.stop_id === parseInt(to));
      
      return {
        ...route,
        stops: route.stops.slice(fromIndex, toIndex + 1),
        total_distance: route.stops[toIndex]?.distance - route.stops[fromIndex]?.distance || 0,
        total_time: route.stops[toIndex]?.time_offset - route.stops[fromIndex]?.time_offset || 0,
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

    if (type && ['bus', 'train'].includes(type)) {
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