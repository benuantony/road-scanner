const db = require('../config/database');

// Search stops with autocomplete
const searchStops = async (req, res) => {
  try {
    const { q, type, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    let query = `
      SELECT id, name, name_tamil, latitude, longitude, district, stop_type
      FROM stops
      WHERE LOWER(name) LIKE LOWER($1)
    `;
    const params = [`%${q}%`];

    if (type && ['bus', 'train', 'both'].includes(type)) {
      query += ` AND (stop_type = $2 OR stop_type = 'both')`;
      params.push(type);
    }

    query += ` ORDER BY 
      CASE 
        WHEN LOWER(name) LIKE LOWER($${params.length + 1}) THEN 0 
        ELSE 1 
      END,
      name
      LIMIT $${params.length + 2}`;
    params.push(`${q}%`, parseInt(limit));

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching stops:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all stops
const getAllStops = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = 'SELECT id, name, name_tamil, latitude, longitude, district, stop_type FROM stops';
    const params = [];

    if (type && ['bus', 'train', 'both'].includes(type)) {
      query += ' WHERE stop_type = $1 OR stop_type = \'both\'';
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

module.exports = {
  searchStops,
  getAllStops,
  getStopById,
};