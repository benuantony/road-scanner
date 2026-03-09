# Tamil Nadu Bus Finder 🚌

A real-time bus route finder and tracker for Tamil Nadu, India. Search for bus routes connecting Chennai, Coimbatore, Nagercoil and 80+ cities across Tamil Nadu.

![Tamil Nadu Bus Finder](https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)

## Features

- 🔍 **Route Search**: Find bus routes between any two stops
- 🗺️ **Interactive Map**: View routes on an interactive map with actual road paths (powered by OSRM)
- 📍 **80+ Bus Stops**: Comprehensive coverage of Chennai, Coimbatore, Nagercoil and surrounding areas
- 🚌 **Live Tracking**: Real-time bus location tracking
- 🛤️ **20+ Routes**: SETC and TNSTC bus routes

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Leaflet
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Maps**: OpenStreetMap + OSRM (Open Source Routing Machine)

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/benuantony/road-scanner.git
   cd road-scanner
   ```

2. **Start the database**
   ```bash
   docker-compose up -d
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the backend server**
   ```bash
   cd ../backend
   npm run dev
   ```

6. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   ```

7. **Open in browser**
   ```
   http://localhost:5173
   ```

## Project Structure

```
road-scanner/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── App.tsx      # Main app with hero section
│   │   │   ├── SearchBar.tsx
│   │   │   ├── RouteMap.tsx # Map with OSRM integration
│   │   │   ├── RouteList.tsx
│   │   │   └── LiveTracker.tsx
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
│   └── ...
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   └── config/          # Database config
│   └── ...
├── database/                 # Database initialization
│   └── init/
│       ├── 01-schema.sql    # Database schema
│       └── 02-seed-data.sql # Bus stops & routes data
└── docker-compose.yml       # Docker configuration
```

## Coverage Areas

### Major Bus Stands
- **Chennai**: CMBT (Koyambedu), Tambaram
- **Coimbatore**: Gandhipuram, Ukkadam, Singanallur
- **Nagercoil**: Main Bus Stand, Kanyakumari

### Routes Covered
- Chennai - Coimbatore Express (via Salem)
- Chennai - Madurai Express
- Chennai - Nagercoil Express
- Coimbatore - Nagercoil Express
- And many more regional routes...

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stops/search` | GET | Search bus stops |
| `/api/routes/find` | GET | Find routes between stops |
| `/api/routes/:id` | GET | Get route details |
| `/api/vehicles` | GET | Get live vehicle positions |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [OSRM](http://project-osrm.org/) for routing engine
- [Leaflet](https://leafletjs.com/) for map library
- [Unsplash](https://unsplash.com/) for hero image