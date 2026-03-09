const db = require('../config/database');

// Search stops with autocomplete - Database only (fast mode)
const searchStops = async (req, res) => {
  try {
    const { q, type, limit = 15 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const limitNum = parseInt(limit);

    // Search in database only (fast - ~10ms response)
    let dbQuery = `
      SELECT id, name, name_tamil, latitude, longitude, district, stop_type, 'db' as source
      FROM stops
      WHERE LOWER(name) LIKE LOWER($1)
    `;
    const params = [`%${q}%`];

    if (type && type === 'bus') {
      dbQuery += ` AND stop_type = 'bus'`;
    }

    dbQuery += ` ORDER BY 
      CASE 
        WHEN LOWER(name) LIKE LOWER($2) THEN 0 
        ELSE 1 
      END,
      name
      LIMIT $3`;
    params.push(`${q}%`, limitNum);

    const dbResult = await db.query(dbQuery, params);
    res.json(dbResult.rows);
  } catch (error) {
    console.error('Error searching stops:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all stops (from database)
const getAllStops = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = 'SELECT id, name, name_tamil, latitude, longitude, district, stop_type FROM stops';
    const params = [];

    if (type && type === 'bus') {
      query += ' WHERE stop_type = $1';
      params.push(type);
    }

    query += ' ORDER BY name';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get stop by ID
const getStopById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT id, name, name_tamil, latitude, longitude, district, stop_type FROM stops WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stop not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search nearby bus stops (using database with distance calculation)
const searchNearbyStops = async (req, res) => {
  try {
    const { lat, lon, radius = 5 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const radiusKm = parseFloat(radius);

    // Haversine formula for distance calculation
    const query = `
      SELECT 
        id, name, name_tamil, latitude, longitude, district, stop_type,
        (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )) AS distance
      FROM stops
      WHERE stop_type = 'bus'
      HAVING (6371 * acos(
        cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) +
        sin(radians($1)) * sin(radians(latitude))
      )) < $3
      ORDER BY distance
      LIMIT 20
    `;

    const result = await db.query(query, [latitude, longitude, radiusKm]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching nearby stops:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  searchStops,
  getAllStops,
  getStopById,
  searchNearbyStops,
};