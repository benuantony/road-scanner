# 🚌 Bangalore Route Finder

A modern, real-time BMTC (Bangalore Metropolitan Transport Corporation) bus route finder with live tracking capabilities. Built with React, Node.js, PostgreSQL, and featuring a sleek dark UI with neon-glowing route visualization.

![Bangalore Route Finder](https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)

## ✨ Features

- **🔍 Route Search**: Find BMTC bus routes between any two stops in Bangalore
- **📍 Live Tracking**: Real-time bus location tracking with WebSocket updates
- **🗺️ Dark Map View**: Grayscale map with glowing neon route visualization
- **📊 ETA Timeline**: Detailed stop-by-stop estimated arrival times
- **🚏 120+ Bus Stops**: Comprehensive coverage of Bangalore including:
  - Majestic (Kempegowda Bus Station)
  - Electronic City
  - Whitefield / ITPL
  - Koramangala
  - Indiranagar
  - Banashankari
  - Jayanagar
  - Hebbal / Yelahanka
  - And many more...
- **🛤️ 40+ Routes**: Including Volvo AC, Vayu Vajra (Airport), and regular BMTC routes

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React-Leaflet** for maps
- **WebSocket** for real-time updates

### Backend
- **Node.js** with Express
- **PostgreSQL** for data storage
- **WebSocket (ws)** for live tracking
- **OSRM** for road-snapped routes

### Data
- **GTFS-based** stop and route data
- Real BMTC bus stops with accurate coordinates
- Proper route sequences with ETA information

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/bangalore-route-finder.git
cd bangalore-route-finder

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### Local Development

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start PostgreSQL (using Docker)
docker-compose up -d db

# Start backend (in backend folder)
npm run dev

# Start frontend (in frontend folder)
npm run dev
```

## 📁 Project Structure

```
bangalore-route-finder/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── RouteMap.tsx       # Dark map with glowing routes
│   │   │   ├── RouteList.tsx      # Route cards with ETA
│   │   │   ├── SearchBar.tsx      # Stop search
│   │   │   └── LiveTracker.tsx    # Vehicle tracking
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── ...
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   └── config/         # Configuration
│   └── ...
├── database/               # Database files
│   └── init/
│       ├── 01-schema.sql   # Database schema
│       └── 02-seed-data.sql # BMTC data (stops, routes)
├── scripts/                # Utility scripts
│   └── parse-gtfs.js       # GTFS parser
└── docker-compose.yml
```

## 🎨 UI Features

### Dark Theme with Neon Accents
- Grayscale CartoDB Dark Matter map tiles
- Glowing cyan route lines
- Purple accent for terminals
- Glass-morphism effects

### ETA Timeline
- Visual stop-by-stop progression
- Estimated arrival times
- Distance markers
- Terminal highlighting

### Live Tracking
- Real-time bus positions
- Progress indicators
- Status badges (Running/Delayed)
- WebSocket-powered updates

## 📡 API Endpoints

### Stops
- `GET /api/stops/search?q={query}` - Search stops
- `GET /api/stops/:id` - Get stop by ID

### Routes
- `GET /api/routes/find?from={id}&to={id}` - Find routes
- `GET /api/routes/:id` - Get route details
- `GET /api/routes` - List all routes

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/route/:routeId` - Vehicles on route

### WebSocket
- `ws://localhost:3000` - Live vehicle updates

## 🗺️ Supported Areas

The app covers major areas in Bangalore:

| Area | Coverage |
|------|----------|
| Central | Majestic, Shivajinagar, MG Road, Cubbon Park |
| South | Electronic City, Koramangala, JP Nagar, Banashankari, Jayanagar |
| East | Whitefield, ITPL, Marathahalli, Indiranagar |
| North | Hebbal, Yelahanka, Manyata Tech Park |
| West | Rajajinagar, Malleshwaram, Vijayanagar |
| Airport | Kempegowda International Airport |

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=road_scanner
DB_USER=postgres
DB_PASSWORD=postgres
```

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [BMTC](https://mybmtc.karnataka.gov.in/) for route information
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [CARTO](https://carto.com/) for dark map tiles
- [Project OSRM](http://project-osrm.org/) for routing