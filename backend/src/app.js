const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const { simulateMovement } = require('./controllers/vehiclesController');
const db = require('./config/database');

const app = express();
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server, path: '/ws/tracking' });

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Tamil Nadu Bus & Train Routes API',
    version: '1.0.0',
    endpoints: {
      stops: {
        search: 'GET /api/stops/search?q=chennai',
        all: 'GET /api/stops',
        byId: 'GET /api/stops/:id',
      },
      routes: {
        find: 'GET /api/routes/find?from=1&to=5',
        all: 'GET /api/routes',
        byId: 'GET /api/routes/:id',
        vehicles: 'GET /api/routes/:routeId/vehicles',
      },
      vehicles: {
        all: 'GET /api/vehicles',
        byId: 'GET /api/vehicles/:id',
      },
      websocket: 'ws://localhost:3001/ws/tracking',
    },
  });
});

// WebSocket connection handling
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket client connected');
  clients.add(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📨 Received:', data);
      
      // Handle subscription to specific routes
      if (data.type === 'subscribe' && data.routeIds) {
        ws.subscribedRoutes = data.routeIds;
        ws.send(JSON.stringify({ type: 'subscribed', routeIds: data.routeIds }));
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });

  // Send initial connection confirmation
  ws.send(JSON.stringify({ type: 'connected', message: 'Connected to vehicle tracking' }));
});

// Broadcast vehicle positions to all connected clients
const broadcastVehiclePositions = async () => {
  if (clients.size === 0) return;

  try {
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
        r.id as route_id,
        r.route_number,
        r.route_name
      FROM vehicles v
      LEFT JOIN stops cs ON v.current_stop_id = cs.id
      LEFT JOIN stops ns ON v.next_stop_id = ns.id
      LEFT JOIN routes r ON v.route_id = r.id
      WHERE v.status = 'running'
      ORDER BY r.route_number, v.vehicle_number
    `);

    const vehicles = result.rows;

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // Filter vehicles based on subscription
        let filteredVehicles = vehicles;
        if (client.subscribedRoutes && client.subscribedRoutes.length > 0) {
          filteredVehicles = vehicles.filter(v => 
            client.subscribedRoutes.includes(v.route_id)
          );
        }

        client.send(JSON.stringify({
          type: 'vehicleUpdate',
          timestamp: new Date().toISOString(),
          vehicles: filteredVehicles,
        }));
      }
    });
  } catch (error) {
    console.error('Error broadcasting vehicle positions:', error);
  }
};

// Start vehicle simulation and broadcast interval
let simulationInterval;
let broadcastInterval;

const startSimulation = () => {
  // Simulate vehicle movement every 3 seconds
  simulationInterval = setInterval(async () => {
    await simulateMovement();
  }, 3000);

  // Broadcast positions every 2 seconds
  broadcastInterval = setInterval(async () => {
    await broadcastVehiclePositions();
  }, 2000);

  console.log('🚌 Vehicle simulation started');
};

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  clearInterval(simulationInterval);
  clearInterval(broadcastInterval);
  
  wss.clients.forEach((client) => {
    client.close();
  });
  
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
🚌 Tamil Nadu Bus & Train Routes API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server running on http://localhost:${PORT}
📡 WebSocket available at ws://localhost:${PORT}/ws/tracking
📚 API Documentation at http://localhost:${PORT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
  
  // Start simulation after server starts
  startSimulation();
});

module.exports = { app, server };