# 🚌 Tamil Nadu Transport Finder

A web application to find and track bus and train routes across Tamil Nadu with real-time vehicle tracking.

![Tamil Nadu Transport Finder](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-20-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue) ![Leaflet](https://img.shields.io/badge/Leaflet-Maps-green)

## 🎯 Features

- **🔍 Route Search** - Search for routes between any two stops with autocomplete
- **➕ Add Intermediate Stops** - Plan routes with multiple stops
- **🗺️ Interactive Map** - View routes on OpenStreetMap with Leaflet
- **📍 Live Tracking** - Real-time vehicle position updates via WebSocket
- **🚌 Bus & Train Support** - Find both bus and train routes
- **🌐 Tamil Language** - Stop names in Tamil and English

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  - Vite + TypeScript                                        │
│  - Tailwind CSS                                             │
│  - Leaflet + React-Leaflet                                  │
│  - WebSocket for live updates                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js)                          │
│  - Express.js                                               │
│  - WebSocket Server                                         │
│  - REST API                                                 │
│  - Vehicle Simulation                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                       │
│  - Stops (40+ locations)                                    │
│  - Routes (15+ bus & train routes)                          │
│  - Vehicles (simulated tracking)                            │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### 1. Start the Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Wait for database to be ready (auto-seeds data)
docker-compose logs -f postgres
```

### 2. Start the Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
```

The API will be available at `http://localhost:3001`

### 3. Start the Frontend

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`

## 📡 API Endpoints

### Stops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stops/search?q=chennai` | Search stops (autocomplete) |
| GET | `/api/stops` | Get all stops |
| GET | `/api/stops/:id` | Get stop by ID |

### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/routes/find?from=1&to=5` | Find routes between stops |
| GET | `/api/routes` | Get all routes |
| GET | `/api/routes/:id` | Get route details |
| GET | `/api/routes/:id/vehicles` | Get vehicles on route |

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | Get all active vehicles |
| GET | `/api/vehicles/:id` | Get vehicle details |

### WebSocket
| Endpoint | Description |
|----------|-------------|
| `ws://localhost:3001/ws/tracking` | Real-time vehicle tracking |

## 🗄️ Database Schema

### Stops
- Major cities: Chennai, Coimbatore, Madurai, Trichy, Salem, etc.
- Both bus stops and railway stations
- Tamil and English names
- GPS coordinates

### Routes
- SETC (State Express) routes
- TNSTC (State Transport) routes
- Southern Railway trains (Shatabdi, Vaigai, etc.)

### Sample Routes
| Route | Type | Path |
|-------|------|------|
| S1 | Bus | Chennai → Salem → Coimbatore |
| S2 | Bus | Chennai → Trichy → Madurai |
| 12243 | Train | Chennai Central → Coimbatore (Shatabdi) |
| 12632 | Train | Chennai Egmore → Madurai (Vaigai) |

## 🎨 UI Layout

```
┌────────────────────────────────────────────────────────────────┐
│  🚌 Tamil Nadu Transport Finder                                │
├────────────────────────────────────────────────────────────────┤
│  [From: ▼] [To: ▼] [+ Add Stop] [🔍 Search]                    │
├────────────────────────────────────────────────────────────────┤
│                               │                                │
│    🗺️ MAP (70%)               │  📋 ROUTE LIST (30%)           │
│    - OpenStreetMap            │  - Available routes            │
│    - Route polylines          │  - Click to select             │
│    - Stop markers             │  - Distance & duration         │
│    - Vehicle positions        │                                │
├───────────────────────────────┴────────────────────────────────┤
│  🔴 LIVE TRACKING                                              │
│  - Real-time vehicle positions                                 │
│  - Progress indicators                                         │
│  - Current & next stop                                         │
└────────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Maps** | Leaflet, React-Leaflet, OpenStreetMap |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL 15 |
| **Real-time** | WebSocket (ws) |
| **Container** | Docker, Docker Compose |

## 📁 Project Structure

```
road-scanner/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── stopsController.js
│   │   │   ├── routesController.js
│   │   │   └── vehiclesController.js
│   │   ├── routes/
│   │   │   └── api.js
│   │   └── app.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── RouteMap.tsx
│   │   │   ├── RouteList.tsx
│   │   │   └── LiveTracker.tsx
│   │   ├── hooks/
│   │   │   └── useVehicleTracking.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── database/
│   └── init/
│       ├── 01-schema.sql
│       └── 02-seed-data.sql
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=roadscanner
DB_USER=roadscanner
DB_PASSWORD=roadscanner123
PORT=3001
```

### Frontend (vite.config.ts)
- API proxy to backend on port 3001
- WebSocket proxy for live tracking

## 🚦 Development

### Run all services
```bash
# Terminal 1 - Database
docker-compose up -d

# Terminal 2 - Backend
cd backend && npm run dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

### Reset database
```bash
docker-compose down -v
docker-compose up -d
```

## 📝 License

ISC

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet for map library
- Tamil Nadu transport data (mocked)