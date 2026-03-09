const db = require('../config/database');

// Get vehicles for a specific route
const getVehiclesByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    const result = await db.query(`
      SELECT 
        v.id,
        v.vehicle_number,
        v.transport_type,
        v.status,
        v.progress_percent,
        v.current_latitude,
        v.current_longitude,
        v.last_updated,
        cs.name as current_stop_name,
        cs.id as current_stop_id,
        ns.name as next_stop_name,
        ns.id as next_stop_id,
        r.route_number,
        r.route_name
      FROM vehicles v
      LEFT JOIN stops cs ON v.current_stop_id = cs.id
      LEFT JOIN stops ns ON v.next_stop_id = ns.id
      LEFT JOIN routes r ON v.route_id = r.id
      WHERE v.route_id = $1
      ORDER BY v.vehicle_number
    `, [routeId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all running vehicles
const getAllVehicles = async (req, res) => {
  try {
    const { type, status = 'running' } = req.query;

    let query = `
      SELECT 
        v.id,
        v.vehicle_number,
        v.transport_type,
        v.status,
        v.progress_percent,
        v.current_latitude,
        v.current_longitude,
        v.last_updated,
        cs.name as current_stop_name,
        cs.id as current_stop_id,
        ns.name as next_stop_name,
        ns.id as next_stop_id,
        r.id as route_id,
        r.route_number,
        r.route_name
      FROM vehicles v
      LEFT JOIN stops cs ON v.current_stop_id = cs.id
      LEFT JOIN stops ns ON v.next_stop_id = ns.id
      LEFT JOIN routes r ON v.route_id = r.id
      WHERE v.status = $1
    `;
    const params = [status];

    if (type && ['bus', 'train'].includes(type)) {
      query += ' AND v.transport_type = $2';
      params.push(type);
    }

    query += ' ORDER BY r.route_number, v.vehicle_number';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get vehicle by ID with route details
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        v.id,
        v.vehicle_number,
        v.transport_type,
        v.status,
        v.progress_percent,
        v.current_latitude,
        v.current_longitude,
        v.last_updated,
        cs.name as current_stop_name,
        cs.id as current_stop_id,
        cs.latitude as current_stop_lat,
        cs.longitude as current_stop_lng,
        ns.name as next_stop_name,
        ns.id as next_stop_id,
        ns.latitude as next_stop_lat,
        ns.longitude as next_stop_lng,
        r.id as route_id,
        r.route_number,
        r.route_name,
        r.operator
      FROM vehicles v
      LEFT JOIN stops cs ON v.current_stop_id = cs.id
      LEFT JOIN stops ns ON v.next_stop_id = ns.id
      LEFT JOIN routes r ON v.route_id = r.id
      WHERE v.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Simulate vehicle movement (for demo purposes)
const simulateMovement = async () => {
  try {
    // Get all running vehicles with their route stops
    const vehicles = await db.query(`
      SELECT 
        v.id,
        v.current_stop_id,
        v.next_stop_id,
        v.progress_percent,
        v.route_id,
        rs_current.stop_sequence as current_sequence,
        (
          SELECT json_agg(json_build_object(
            'stop_id', rs.stop_id,
            'sequence', rs.stop_sequence,
            'latitude', s.latitude,
            'longitude', s.longitude
          ) ORDER BY rs.stop_sequence)
          FROM route_stops rs
          JOIN stops s ON rs.stop_id = s.id
          WHERE rs.route_id = v.route_id
        ) as route_stops
      FROM vehicles v
      LEFT JOIN route_stops rs_current ON v.route_id = rs_current.route_id AND v.current_stop_id = rs_current.stop_id
      WHERE v.status = 'running'
    `);

    for (const vehicle of vehicles.rows) {
      if (!vehicle.route_stops || vehicle.route_stops.length === 0) continue;

      const stops = vehicle.route_stops;
      const currentIndex = stops.findIndex(s => s.stop_id === vehicle.current_stop_id);
      
      if (currentIndex === -1) continue;

      let newProgress = (vehicle.progress_percent || 0) + Math.random() * 15 + 5;
      let newCurrentStopId = vehicle.current_stop_id;
      let newNextStopId = vehicle.next_stop_id;
      let newLat, newLng;

      if (newProgress >= 100) {
        // Move to next stop
        const nextIndex = currentIndex + 1;
        if (nextIndex < stops.length) {
          newCurrentStopId = stops[nextIndex].stop_id;
          newNextStopId = nextIndex + 1 < stops.length ? stops[nextIndex + 1].stop_id : null;
          newProgress = 0;
          newLat = stops[nextIndex].latitude;
          newLng = stops[nextIndex].longitude;
        } else {
          // Reached end of route, restart from beginning
          newCurrentStopId = stops[0].stop_id;
          newNextStopId = stops.length > 1 ? stops[1].stop_id : null;
          newProgress = 0;
          newLat = stops[0].latitude;
          newLng = stops[0].longitude;
        }
      } else {
        // Interpolate position between current and next stop
        const nextIndex = currentIndex + 1;
        if (nextIndex < stops.length) {
          const currentStop = stops[currentIndex];
          const nextStop = stops[nextIndex];
          const progress = newProgress / 100;
          
          newLat = currentStop.latitude + (nextStop.latitude - currentStop.latitude) * progress;
          newLng = currentStop.longitude + (nextStop.longitude - currentStop.longitude) * progress;
          newNextStopId = nextStop.stop_id;
        }
      }

      // Update vehicle position
      await db.query(`
        UPDATE vehicles 
        SET 
          current_stop_id = $1,
          next_stop_id = $2,
          progress_percent = $3,
          current_latitude = $4,
          current_longitude = $5,
          last_updated = CURRENT_TIMESTAMP
        WHERE id = $6
      `, [newCurrentStopId, newNextStopId, newProgress, newLat, newLng, vehicle.id]);
    }

    return true;
  } catch (error) {
    console.error('Error simulating movement:', error);
    return false;
  }
};

module.exports = {
  getVehiclesByRoute,
  getAllVehicles,
  getVehicleById,
  simulateMovement,
};