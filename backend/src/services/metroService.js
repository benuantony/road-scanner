const db = require('../config/database');

// Namma Metro Bangalore station data (static since metro GTFS isn't readily available)
// Purple Line (North-South) and Green Line (East-West)
const NAMMA_METRO_DATA = {
  stations: [
    // Purple Line (Challaghatta to Whitefield)
    { id: 'metro_p1', name: 'Challaghatta', line: 'purple', lat: 12.9888, lng: 77.5048, sequence: 1 },
    { id: 'metro_p2', name: 'Kengeri Bus Terminal', line: 'purple', lat: 12.9129, lng: 77.4862, sequence: 2 },
    { id: 'metro_p3', name: 'Kengeri', line: 'purple', lat: 12.9178, lng: 77.4963, sequence: 3 },
    { id: 'metro_p4', name: 'Jnana Bharathi', line: 'purple', lat: 12.9342, lng: 77.5107, sequence: 4 },
    { id: 'metro_p5', name: 'Rajarajeshwari Nagar', line: 'purple', lat: 12.9256, lng: 77.5189, sequence: 5 },
    { id: 'metro_p6', name: 'Nayandahalli', line: 'purple', lat: 12.9520, lng: 77.5276, sequence: 6 },
    { id: 'metro_p7', name: 'Mysuru Road', line: 'purple', lat: 12.9567, lng: 77.5389, sequence: 7 },
    { id: 'metro_p8', name: 'Deepanjali Nagar', line: 'purple', lat: 12.9620, lng: 77.5466, sequence: 8 },
    { id: 'metro_p9', name: 'Attiguppe', line: 'purple', lat: 12.9660, lng: 77.5535, sequence: 9 },
    { id: 'metro_p10', name: 'Vijayanagar', line: 'purple', lat: 12.9707, lng: 77.5593, sequence: 10 },
    { id: 'metro_p11', name: 'Hosahalli', line: 'purple', lat: 12.9735, lng: 77.5658, sequence: 11 },
    { id: 'metro_p12', name: 'Magadi Road', line: 'purple', lat: 12.9761, lng: 77.5710, sequence: 12 },
    { id: 'metro_p13', name: 'Sri Balagangadharanatha Swamiji Station (City Railway)', line: 'purple', lat: 12.9756, lng: 77.5723, sequence: 13 },
    { id: 'metro_p14', name: 'Nadaprabhu Kempegowda Station (Majestic)', line: 'purple', lat: 12.9772, lng: 77.5719, sequence: 14 },
    { id: 'metro_p15', name: 'Sir M. Visveshwaraya Station (Central College)', line: 'purple', lat: 12.9783, lng: 77.5889, sequence: 15 },
    { id: 'metro_p16', name: 'Dr. B.R. Ambedkar Station (Cubbon Park)', line: 'purple', lat: 12.9765, lng: 77.5943, sequence: 16 },
    { id: 'metro_p17', name: 'MG Road', line: 'purple', lat: 12.9757, lng: 77.6069, sequence: 17 },
    { id: 'metro_p18', name: 'Trinity', line: 'purple', lat: 12.9725, lng: 77.6194, sequence: 18 },
    { id: 'metro_p19', name: 'Halasuru', line: 'purple', lat: 12.9785, lng: 77.6248, sequence: 19 },
    { id: 'metro_p20', name: 'Indiranagar', line: 'purple', lat: 12.9783, lng: 77.6408, sequence: 20 },
    { id: 'metro_p21', name: 'Swami Vivekananda Road', line: 'purple', lat: 12.9850, lng: 77.6575, sequence: 21 },
    { id: 'metro_p22', name: 'Baiyappanahalli', line: 'purple', lat: 12.9916, lng: 77.6652, sequence: 22 },
    
    // Green Line (Nagasandra to Silk Institute)
    { id: 'metro_g1', name: 'Nagasandra', line: 'green', lat: 13.0384, lng: 77.5148, sequence: 1 },
    { id: 'metro_g2', name: 'Dasarahalli', line: 'green', lat: 13.0316, lng: 77.5159, sequence: 2 },
    { id: 'metro_g3', name: 'Jalahalli', line: 'green', lat: 13.0274, lng: 77.5373, sequence: 3 },
    { id: 'metro_g4', name: 'Peenya Industry', line: 'green', lat: 13.0296, lng: 77.5180, sequence: 4 },
    { id: 'metro_g5', name: 'Peenya', line: 'green', lat: 13.0128, lng: 77.5209, sequence: 5 },
    { id: 'metro_g6', name: 'Goraguntepalya', line: 'green', lat: 13.0087, lng: 77.5306, sequence: 6 },
    { id: 'metro_g7', name: 'Yeshwanthpur', line: 'green', lat: 13.0283, lng: 77.5407, sequence: 7 },
    { id: 'metro_g8', name: 'Sandal Soap Factory', line: 'green', lat: 13.0192, lng: 77.5538, sequence: 8 },
    { id: 'metro_g9', name: 'Mahalakshmi', line: 'green', lat: 13.0095, lng: 77.5612, sequence: 9 },
    { id: 'metro_g10', name: 'Rajajinagar', line: 'green', lat: 13.0015, lng: 77.5638, sequence: 10 },
    { id: 'metro_g11', name: 'Kuvempu Road', line: 'green', lat: 12.9946, lng: 77.5685, sequence: 11 },
    { id: 'metro_g12', name: 'Srirampura', line: 'green', lat: 12.9867, lng: 77.5695, sequence: 12 },
    { id: 'metro_g13', name: 'Mantri Square Sampige Road', line: 'green', lat: 12.9829, lng: 77.5735, sequence: 13 },
    { id: 'metro_g14', name: 'Nadaprabhu Kempegowda Station (Majestic)', line: 'green', lat: 12.9772, lng: 77.5719, sequence: 14 },
    { id: 'metro_g15', name: 'Chickpete', line: 'green', lat: 12.9696, lng: 77.5767, sequence: 15 },
    { id: 'metro_g16', name: 'Krishna Rajendra Market', line: 'green', lat: 12.9622, lng: 77.5783, sequence: 16 },
    { id: 'metro_g17', name: 'National College', line: 'green', lat: 12.9519, lng: 77.5773, sequence: 17 },
    { id: 'metro_g18', name: 'Lalbagh', line: 'green', lat: 12.9482, lng: 77.5798, sequence: 18 },
    { id: 'metro_g19', name: 'South End Circle', line: 'green', lat: 12.9403, lng: 77.5824, sequence: 19 },
    { id: 'metro_g20', name: 'Jayanagar', line: 'green', lat: 12.9318, lng: 77.5851, sequence: 20 },
    { id: 'metro_g21', name: 'R.V. Road', line: 'green', lat: 12.9231, lng: 77.5878, sequence: 21 },
    { id: 'metro_g22', name: 'Banashankari', line: 'green', lat: 12.9150, lng: 77.5792, sequence: 22 },
    { id: 'metro_g23', name: 'Jaya Prakash Nagar', line: 'green', lat: 12.9065, lng: 77.5725, sequence: 23 },
    { id: 'metro_g24', name: 'Yelachenahalli', line: 'green', lat: 12.8989, lng: 77.5689, sequence: 24 },
    { id: 'metro_g25', name: 'Konanakunte Cross', line: 'green', lat: 12.8899, lng: 77.5667, sequence: 25 },
    { id: 'metro_g26', name: 'Doddakallasandra', line: 'green', lat: 12.8785, lng: 77.5558, sequence: 26 },
    { id: 'metro_g27', name: 'Vajarahalli', line: 'green', lat: 12.8689, lng: 77.5478, sequence: 27 },
    { id: 'metro_g28', name: 'Thalaghattapura', line: 'green', lat: 12.8578, lng: 77.5389, sequence: 28 },
    { id: 'metro_g29', name: 'Silk Institute', line: 'green', lat: 12.8478, lng: 77.5300, sequence: 29 },
  ],
  routes: [
    {
      id: 'purple_line',
      number: 'Purple Line',
      name: 'Challaghatta ⇔ Whitefield (Kadugodi)',
      line: 'purple',
    },
    {
      id: 'green_line',
      number: 'Green Line',
      name: 'Nagasandra ⇔ Silk Institute',
      line: 'green',
    },
  ],
};

// Check if metro data already exists
async function hasMetroData() {
  try {
    const result = await db.query(
      "SELECT COUNT(*) as count FROM routes WHERE transport_type = 'metro'"
    );
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('Error checking metro data:', error);
    return false;
  }
}

// Import metro data into the database
async function importMetroData() {
  console.log('📍 Importing Namma Metro data...');
  
  try {
    // Get current max IDs to avoid conflicts
    const maxStopResult = await db.query('SELECT COALESCE(MAX(id), 0) as max_id FROM stops');
    let stopIdCounter = parseInt(maxStopResult.rows[0].max_id) + 1;
    
    const maxRouteResult = await db.query('SELECT COALESCE(MAX(id), 0) as max_id FROM routes');
    let routeIdCounter = parseInt(maxRouteResult.rows[0].max_id) + 1;
    
    // Map station IDs to database IDs
    const stationIdMap = {};
    const routeIdMap = {};
    
    // Insert metro stations as stops
    console.log(`   Inserting ${NAMMA_METRO_DATA.stations.length} metro stations...`);
    for (const station of NAMMA_METRO_DATA.stations) {
      const result = await db.query(`
        INSERT INTO stops (name, name_tamil, latitude, longitude, district, stop_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        station.name,
        station.name,
        station.lat,
        station.lng,
        'Bangalore',
        'metro'
      ]);
      stationIdMap[station.id] = result.rows[0].id;
    }
    
    // Insert metro routes
    console.log(`   Inserting ${NAMMA_METRO_DATA.routes.length} metro routes...`);
    for (const route of NAMMA_METRO_DATA.routes) {
      const result = await db.query(`
        INSERT INTO routes (route_number, route_name, transport_type, operator)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [
        route.number,
        route.name,
        'metro',
        'BMRCL Namma Metro'
      ]);
      routeIdMap[route.id] = result.rows[0].id;
    }
    
    // Insert route_stops for each line
    console.log('   Creating route-stop connections...');
    
    // Purple Line stations
    const purpleStations = NAMMA_METRO_DATA.stations
      .filter(s => s.line === 'purple')
      .sort((a, b) => a.sequence - b.sequence);
    
    let routeStopsInserted = 0;
    for (let i = 0; i < purpleStations.length; i++) {
      const station = purpleStations[i];
      const stopId = stationIdMap[station.id];
      const routeId = routeIdMap['purple_line'];
      
      await db.query(`
        INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (route_id, stop_id) DO NOTHING
      `, [
        routeId,
        stopId,
        i + 1,
        (i * 1.2).toFixed(2), // Approx 1.2km between stations
        i * 3 // Approx 3 mins between stations
      ]);
      routeStopsInserted++;
    }
    
    // Green Line stations
    const greenStations = NAMMA_METRO_DATA.stations
      .filter(s => s.line === 'green')
      .sort((a, b) => a.sequence - b.sequence);
    
    for (let i = 0; i < greenStations.length; i++) {
      const station = greenStations[i];
      const stopId = stationIdMap[station.id];
      const routeId = routeIdMap['green_line'];
      
      await db.query(`
        INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (route_id, stop_id) DO NOTHING
      `, [
        routeId,
        stopId,
        i + 1,
        (i * 1.2).toFixed(2),
        i * 3
      ]);
      routeStopsInserted++;
    }
    
    console.log(`✅ Metro data imported:`);
    console.log(`   - ${Object.keys(stationIdMap).length} stations`);
    console.log(`   - ${Object.keys(routeIdMap).length} routes`);
    console.log(`   - ${routeStopsInserted} route-stop connections`);
    
    return {
      stations: Object.keys(stationIdMap).length,
      routes: Object.keys(routeIdMap).length,
      route_stops: routeStopsInserted,
    };
  } catch (error) {
    console.error('❌ Error importing metro data:', error);
    throw error;
  }
}

// Initialize metro data on startup
async function initMetroData() {
  try {
    const hasData = await hasMetroData();
    if (!hasData) {
      console.log('🚇 No metro data found, importing Namma Metro stations...');
      await importMetroData();
    } else {
      console.log('✅ Metro data already exists');
    }
  } catch (error) {
    console.error('⚠️ Failed to initialize metro data:', error.message);
    // Don't throw - let the app continue without metro data
  }
}

module.exports = {
  initMetroData,
  importMetroData,
  hasMetroData,
};