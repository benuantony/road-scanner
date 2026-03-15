#!/usr/bin/env node
/**
 * BMTC GTFS Parser
 * Parses GTFS text files and generates SQL seed data for Bangalore bus routes
 * 
 * GTFS Files Expected:
 * - stops.txt: Stop ID, name, latitude, longitude
 * - routes.txt: Route ID, short name, long name
 * - trips.txt: Trip ID, route ID, service ID
 * - stop_times.txt: Trip ID, arrival time, departure time, stop ID, stop sequence
 */

const fs = require('fs');
const path = require('path');

// Parse CSV/GTFS text file
function parseGTFS(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });
}

// Generate SQL from parsed GTFS data
function generateSQL(stops, routes, trips, stopTimes) {
  let sql = `-- Bangalore BMTC Bus Routes - Generated from GTFS Data
-- Generated on: ${new Date().toISOString()}

`;

  // Generate stops SQL
  sql += `-- =====================================================
-- STOPS (Bangalore BMTC Bus Stops)
-- =====================================================

INSERT INTO stops (name, name_tamil, latitude, longitude, district, stop_type) VALUES
`;

  const stopLines = stops.map((stop, i) => {
    const name = stop.stop_name.replace(/'/g, "''");
    const lat = parseFloat(stop.stop_lat).toFixed(8);
    const lon = parseFloat(stop.stop_lon).toFixed(8);
    return `('${name}', NULL, ${lat}, ${lon}, 'Bangalore', 'bus')`;
  });

  sql += stopLines.join(',\n') + ';\n\n';

  // Generate routes SQL
  sql += `-- =====================================================
-- ROUTES (BMTC Bus Routes)
-- =====================================================

INSERT INTO routes (route_number, route_name, transport_type, operator, frequency_mins) VALUES
`;

  const routeLines = routes.map(route => {
    const number = route.route_short_name.replace(/'/g, "''");
    const name = route.route_long_name.replace(/'/g, "''");
    return `('${number}', '${name}', 'bus', 'BMTC', 15)`;
  });

  sql += routeLines.join(',\n') + ';\n\n';

  return sql;
}

// Main execution
async function main() {
  const gtfsDir = path.join(__dirname, '..', 'data', 'gtfs');
  
  console.log('BMTC GTFS Parser');
  console.log('================\n');
  
  // Check for GTFS files
  const requiredFiles = ['stops.txt', 'routes.txt'];
  const missingFiles = requiredFiles.filter(f => !fs.existsSync(path.join(gtfsDir, f)));
  
  if (missingFiles.length > 0) {
    console.log('GTFS files not found. Generating sample Bangalore BMTC data...\n');
    console.log('For real data, place GTFS files in:', gtfsDir);
    console.log('Required files:', requiredFiles.join(', '));
    return;
  }
  
  // Parse files
  const stops = parseGTFS(fs.readFileSync(path.join(gtfsDir, 'stops.txt'), 'utf8'));
  const routes = parseGTFS(fs.readFileSync(path.join(gtfsDir, 'routes.txt'), 'utf8'));
  
  console.log(`Parsed ${stops.length} stops`);
  console.log(`Parsed ${routes.length} routes`);
  
  // Generate SQL
  const sql = generateSQL(stops, routes, [], []);
  
  const outputPath = path.join(__dirname, '..', 'database', 'init', '02-seed-data.sql');
  fs.writeFileSync(outputPath, sql);
  
  console.log(`\nGenerated SQL file: ${outputPath}`);
}

main().catch(console.error);