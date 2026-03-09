const express = require('express');
const router = express.Router();

const stopsController = require('../controllers/stopsController');
const routesController = require('../controllers/routesController');
const vehiclesController = require('../controllers/vehiclesController');

// =====================================================
// STOPS ROUTES
// =====================================================

// Search stops (autocomplete)
// GET /api/stops/search?q=chennai&type=bus&limit=10
router.get('/stops/search', stopsController.searchStops);

// Get all stops
// GET /api/stops?type=bus
router.get('/stops', stopsController.getAllStops);

// Get stop by ID
// GET /api/stops/:id
router.get('/stops/:id', stopsController.getStopById);

// =====================================================
// ROUTES ROUTES
// =====================================================

// Find routes between stops
// GET /api/routes/find?from=1&to=5&stops=2,3&type=bus
router.get('/routes/find', routesController.findRoutes);

// Get all routes
// GET /api/routes?type=bus
router.get('/routes', routesController.getAllRoutes);

// Get route by ID
// GET /api/routes/:id
router.get('/routes/:id', routesController.getRouteById);

// =====================================================
// VEHICLES ROUTES
// =====================================================

// Get all vehicles
// GET /api/vehicles?type=bus&status=running
router.get('/vehicles', vehiclesController.getAllVehicles);

// Get vehicle by ID
// GET /api/vehicles/:id
router.get('/vehicles/:id', vehiclesController.getVehicleById);

// Get vehicles for a specific route
// GET /api/routes/:routeId/vehicles
router.get('/routes/:routeId/vehicles', vehiclesController.getVehiclesByRoute);

module.exports = router;