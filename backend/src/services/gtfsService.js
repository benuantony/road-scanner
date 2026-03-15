const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');
const readline = require('readline');
const db = require('../config/database');

// Temporary directory for GTFS files
const TEMP_DIR = path.join(__dirname, '../../temp/gtfs');

// Ensure temp directory exists
function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

// Download file from URL with proper headers
function downloadFile(url, destPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    // Prevent infinite redirects
    if (redirectCount > 10) {
      reject(new Error('Too many redirects'));
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/zip, application/octet-stream, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive'
      }
    };

    // Parse URL for options
    const urlObj = new URL(url);
    options.hostname = urlObj.hostname;
    options.path = urlObj.pathname + urlObj.search;
    options.port = urlObj.port || (url.startsWith('https') ? 443 : 80);
    
    const req = protocol.get(options, (response) => {
      // Handle redirects (301, 302, 303, 307, 308)
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        file.close();
        fs.unlinkSync(destPath);
        const redirectUrl = response.headers.location;
        console.log(`Redirecting to: ${redirectUrl}`);
        
        // Handle relative redirects
        const newUrl = redirectUrl.startsWith('http') 
          ? redirectUrl 
          : `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
        
        downloadFile(newUrl, destPath, redirectCount + 1)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`Failed to download: HTTP ${response.statusCode} - ${response.statusMessage || 'Unknown error'}. The GTFS source may require browser download.`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Download complete: ${destPath}`);
        resolve(destPath);
      });
    });
    
    req.on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
    
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Download timeout after 60 seconds'));
    });
  });
}

// Extract ZIP file using unzipper or built-in
async function extractZip(zipPath, destDir) {
  // Use child_process to unzip (works on most systems)
  const { exec } = require('child_process');
  return new Promise((resolve, reject) => {
    exec(`unzip -o "${zipPath}" -d "${destDir}"`, (error, stdout, stderr) => {
      if (error) {
        // Try with tar for .zip on some systems
        exec(`tar -xf "${zipPath}" -C "${destDir}"`, (error2) => {
          if (error2) {
            reject(new Error('Failed to extract ZIP file'));
          } else {
            resolve(destDir);
          }
        });
      } else {
        resolve(destDir);
      }
    });
  });
}

// Parse CSV file line by line
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      resolve([]);
      return;
    }
    
    const results = [];
    let headers = null;
    
    const rl = readline.createInterface({
      input: createReadStream(filePath, { encoding: 'utf8' }),
      crlfDelay: Infinity
    });
    
    rl.on('line', (line) => {
      // Handle CSV parsing (simple, handles basic cases)
      const values = parseCSVLine(line);
      
      if (!headers) {
        headers = values.map(h => h.trim().toLowerCase());
      } else {
        const row = {};
        headers.forEach((header, i) => {
          row[header] = values[i]?.trim() || '';
        });
        results.push(row);
      }
    });
    
    rl.on('close', () => resolve(results));
    rl.on('error', reject);
  });
}

// Parse a single CSV line (handles quoted values)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

// Map GTFS string IDs to integer IDs
const stopIdMap = new Map();
const routeIdMap = new Map();

// Import stops from GTFS
async function importStops(stopsData) {
  console.log(`Importing ${stopsData.length} stops...`);
  
  // Clear existing data and reset sequences
  await db.query('TRUNCATE TABLE route_stops, vehicles, routes, stops RESTART IDENTITY CASCADE');
  
  // Reset ID maps
  stopIdMap.clear();
  
  let imported = 0;
  const batchSize = 500;
  
  for (let i = 0; i < stopsData.length; i += batchSize) {
    const batch = stopsData.slice(i, i + batchSize);
    const values = [];
    const params = [];
    
    batch.forEach((stop, idx) => {
      const newId = i + idx + 1; // Generate sequential integer ID
      stopIdMap.set(stop.stop_id, newId); // Map GTFS ID to our integer ID
      
      const baseIdx = idx * 5;
      values.push(`($${baseIdx + 1}, $${baseIdx + 2}, $${baseIdx + 3}, $${baseIdx + 4}, $${baseIdx + 5})`);
      params.push(
        stop.stop_name || 'Unknown Stop',
        stop.stop_name || null, // Tamil name (use same if not available)
        parseFloat(stop.stop_lat) || 0,
        parseFloat(stop.stop_lon) || 0,
        'Bangalore'
      );
    });
    
    if (values.length > 0) {
      await db.query(`
        INSERT INTO stops (name, name_tamil, latitude, longitude, district)
        VALUES ${values.join(', ')}
      `, params);
      imported += batch.length;
    }
  }
  
  // Rebuild ID map from database after insert
  const result = await db.query('SELECT id, name FROM stops ORDER BY id');
  stopIdMap.clear();
  stopsData.forEach((stop, idx) => {
    if (idx < result.rows.length) {
      stopIdMap.set(stop.stop_id, result.rows[idx].id);
    }
  });
  
  return imported;
}

// Import routes from GTFS
async function importRoutes(routesData) {
  console.log(`Importing ${routesData.length} routes...`);
  
  // Reset route ID map
  routeIdMap.clear();
  
  let imported = 0;
  const batchSize = 100;
  
  for (let i = 0; i < routesData.length; i += batchSize) {
    const batch = routesData.slice(i, i + batchSize);
    const values = [];
    const params = [];
    
    batch.forEach((route, idx) => {
      const baseIdx = idx * 4;
      values.push(`($${baseIdx + 1}, $${baseIdx + 2}, $${baseIdx + 3}, $${baseIdx + 4})`);
      
      // Determine operator based on route name/type
      let operator = 'BMTC Regular';
      const routeShortName = (route.route_short_name || '').toUpperCase();
      if (routeShortName.includes('V-') || routeShortName.includes('VOLVO')) {
        operator = 'BMTC Volvo';
      } else if (routeShortName.includes('KIA') || routeShortName.includes('VAJRA')) {
        operator = 'BMTC Vayu Vajra';
      }
      
      params.push(
        route.route_short_name || route.route_id || 'Unknown',
        route.route_long_name || route.route_short_name || 'Unknown Route',
        'bus',
        operator
      );
    });
    
    if (values.length > 0) {
      await db.query(`
        INSERT INTO routes (route_number, route_name, transport_type, operator)
        VALUES ${values.join(', ')}
      `, params);
      imported += batch.length;
    }
  }
  
  // Rebuild route ID map from database after insert
  const result = await db.query('SELECT id, route_number FROM routes ORDER BY id');
  routesData.forEach((route, idx) => {
    if (idx < result.rows.length) {
      routeIdMap.set(route.route_id, result.rows[idx].id);
    }
  });
  
  return imported;
}

// Import route_stops from GTFS stop_times
async function importRouteStops(stopTimesData, tripsData) {
  console.log(`Processing ${stopTimesData.length} stop times...`);
  
  // Create trip to route mapping (GTFS IDs)
  const tripToRoute = {};
  tripsData.forEach(trip => {
    tripToRoute[trip.trip_id] = trip.route_id;
  });
  
  // Group stop_times by trip_id, then by route_id (take first trip per route)
  const routeStopsGTFS = {};
  
  stopTimesData.forEach(st => {
    const gtfsRouteId = tripToRoute[st.trip_id];
    if (!gtfsRouteId) return;
    
    if (!routeStopsGTFS[gtfsRouteId]) {
      routeStopsGTFS[gtfsRouteId] = [];
    }
    
    // Only add if this sequence doesn't exist for this route yet
    const seq = parseInt(st.stop_sequence) || 0;
    if (!routeStopsGTFS[gtfsRouteId].find(s => s.sequence === seq)) {
      // Parse arrival time to minutes from midnight
      const arrivalMins = parseTimeToMinutes(st.arrival_time || st.departure_time);
      
      routeStopsGTFS[gtfsRouteId].push({
        gtfs_route_id: gtfsRouteId,
        gtfs_stop_id: st.stop_id,
        sequence: seq,
        arrival_mins: arrivalMins
      });
    }
  });
  
  // Calculate relative times (from first stop) and insert
  let imported = 0;
  
  for (const [gtfsRouteId, stops] of Object.entries(routeStopsGTFS)) {
    // Convert GTFS route ID to our integer ID
    const routeId = routeIdMap.get(gtfsRouteId);
    if (!routeId) {
      console.log(`Route not found for GTFS ID: ${gtfsRouteId}`);
      continue;
    }
    
    // Sort by sequence
    stops.sort((a, b) => a.sequence - b.sequence);
    
    // Get base time (first stop)
    const baseTime = stops[0]?.arrival_mins || 0;
    
    // Calculate cumulative distance (estimated)
    let cumDistance = 0;
    
    const values = [];
    const params = [];
    let paramIdx = 1;
    
    stops.forEach((stop, idx) => {
      // Convert GTFS stop ID to our integer ID
      const stopId = stopIdMap.get(stop.gtfs_stop_id);
      if (!stopId) {
        return; // Skip unknown stops
      }
      
      const relativeTime = stop.arrival_mins - baseTime;
      
      values.push(`($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3}, $${paramIdx + 4})`);
      params.push(
        routeId,
        stopId,
        idx + 1, // Use sequential order
        cumDistance.toFixed(2),
        Math.max(0, relativeTime) // Ensure non-negative
      );
      paramIdx += 5;
      
      cumDistance += 1.5; // Estimate 1.5km between stops on average
    });
    
    if (values.length > 0) {
      try {
        await db.query(`
          INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
          VALUES ${values.join(', ')}
          ON CONFLICT (route_id, stop_id) DO UPDATE SET
            stop_sequence = EXCLUDED.stop_sequence,
            distance_from_start = EXCLUDED.distance_from_start,
            arrival_offset_mins = EXCLUDED.arrival_offset_mins
        `, params);
        imported += values.length;
      } catch (err) {
        // Skip routes with invalid stop references
        console.log(`Skipping route ${routeId}: ${err.message}`);
      }
    }
  }
  
  return imported;
}

// Parse GTFS time (HH:MM:SS) to minutes
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  return hours * 60 + minutes;
}

// Main import function
async function importGTFS(url) {
  console.log(`Starting GTFS import from: ${url}`);
  
  ensureTempDir();
  const zipPath = path.join(TEMP_DIR, 'gtfs.zip');
  const extractDir = path.join(TEMP_DIR, 'extracted');
  
  try {
    // Step 1: Download ZIP
    console.log('Downloading GTFS file...');
    await downloadFile(url, zipPath);
    console.log('Download complete.');
    
    // Step 2: Extract ZIP
    console.log('Extracting GTFS files...');
    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true });
    }
    fs.mkdirSync(extractDir, { recursive: true });
    await extractZip(zipPath, extractDir);
    console.log('Extraction complete.');
    
    // Step 3: Find extracted files (might be in subdirectory)
    let gtfsDir = extractDir;
    const files = fs.readdirSync(extractDir);
    if (files.length === 1 && fs.statSync(path.join(extractDir, files[0])).isDirectory()) {
      gtfsDir = path.join(extractDir, files[0]);
    }
    
    // Step 4: Parse CSV files
    console.log('Parsing GTFS files...');
    const stops = await parseCSV(path.join(gtfsDir, 'stops.txt'));
    const routes = await parseCSV(path.join(gtfsDir, 'routes.txt'));
    const trips = await parseCSV(path.join(gtfsDir, 'trips.txt'));
    const stopTimes = await parseCSV(path.join(gtfsDir, 'stop_times.txt'));
    
    console.log(`Parsed: ${stops.length} stops, ${routes.length} routes, ${trips.length} trips, ${stopTimes.length} stop_times`);
    
    // Step 5: Import to database
    console.log('Importing to database...');
    const stopsImported = await importStops(stops);
    const routesImported = await importRoutes(routes);
    const routeStopsImported = await importRouteStops(stopTimes, trips);
    
    // Step 6: Record import metadata
    const result = {
      success: true,
      source: url,
      imported_at: new Date().toISOString(),
      stats: {
        stops: stopsImported,
        routes: routesImported,
        route_stops: routeStopsImported
      }
    };
    
    // Cleanup
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    
    console.log('GTFS import complete!', result);
    return result;
    
  } catch (error) {
    console.error('GTFS import failed:', error);
    throw error;
  }
}

// Get current data status
async function getStatus() {
  const stopsResult = await db.query('SELECT COUNT(*) FROM stops');
  const routesResult = await db.query('SELECT COUNT(*) FROM routes');
  const routeStopsResult = await db.query('SELECT COUNT(*) FROM route_stops');
  
  return {
    stops: parseInt(stopsResult.rows[0].count),
    routes: parseInt(routesResult.rows[0].count),
    route_stops: parseInt(routeStopsResult.rows[0].count)
  };
}

// Clear all data
async function clearData() {
  await db.query('TRUNCATE TABLE vehicles, route_stops, routes, stops RESTART IDENTITY CASCADE');
  return { success: true, message: 'All data cleared' };
}

module.exports = {
  importGTFS,
  getStatus,
  clearData
};