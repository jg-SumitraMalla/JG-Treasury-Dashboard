# APAC UI File Server

A FastAPI-based static file server for serving the APAC UI Warehouse frontend application.

## Features

- 🚀 **FastAPI** - High-performance Python web framework
- 📁 **Static File Serving** - Efficient serving of JS, CSS, images, and fonts
- 🔄 **SPA Support** - Proper fallback routing for client-side routing
- 🏥 **Health Checks** - `/health` and `/ready` endpoints for container orchestration
- 🌍 **Multi-Environment** - Support for local, development, and production environments

## Prerequisites

- Python 3.11+
- uv (for dependency management)
- Built container-ui (`npm run build` in container-ui)

## Installation

```bash
cd apps/file-server

# Using uv
uv sync

# Or using pip
pip install -e .
```

## Development

```bash
# Start the server (with hot reload in local mode)
uv run file-server

# Or specify environment
APP_ENV=local uv run file-server
```

## Production

```bash
# Set environment and run
APP_ENV=production uv run file-server

# Or run directly with uvicorn
APP_ENV=production uvicorn file_server.main:app --host 0.0.0.0 --port 3000
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Server host |
| `PORT` | `3000` | Server port |
| `APP_ENV` | `local` | Application environment (local/development/production) |
| `BUILD_PATH` | `./build` | Path to the UI build folder |
| `BASE_PATH` | `/ui` | Base URL path for serving the UI |

## Environments

| Environment | UI Base URL | API Base URL |
|-------------|-------------|--------------|
| `local` | `http://localhost:3000` | `http://localhost:9000` |
| `development` | `https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net` | `https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net` |
| `production` | `https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net` | `https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net` |

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `/` | Redirects to `/ui` |
| `/ui/*` | Serves the SPA application |
| `/health` | Health check endpoint |
| `/ready` | Readiness check (verifies build files exist) |

## Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2026-01-09T12:00:00.000Z",
  "uptime": 123.45,
  "appEnv": "production",
  "apiBaseUrl": "https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net",
  "buildPath": "/app/build"
}
```

## Docker

### Build the image

The Dockerfile uses a build argument `APP_ENV` to determine which environment to build for:

```bash
# From monorepo root

# Build for PRODUCTION (default)
docker build -f apps/file-server/Dockerfile -t apac-file-server:prod .

# Build for DEVELOPMENT
docker build -f apps/file-server/Dockerfile --build-arg APP_ENV=development -t apac-file-server:dev .
```

### Run the container

```bash
# Run production build
docker run -p 3000:3000 apac-file-server:prod

# Run development build
docker run -p 3000:3000 apac-file-server:dev
```

### Build Arguments vs Runtime Environment

| Setting | Build Time (`--build-arg`) | Runtime (`-e`) |
|---------|---------------------------|----------------|
| UI redirect URLs | ✅ Baked in during build | ❌ Cannot change |
| UI API endpoints | ✅ Baked in during build | ❌ Cannot change |
| Server API info | ✅ Set from build arg | ✅ Can override |
| Health check info | N/A | ✅ Reflects current |

**Important**: The UI is a static build. The redirect URIs and API URLs are compiled into the JavaScript bundle. You must build separate images for dev and prod if they use different URLs.

## Project Structure

```
apps/file-server/
├── file_server/
│   ├── __init__.py      # Package initialization
│   ├── config.py        # Settings and configuration
│   └── main.py          # FastAPI application
├── pyproject.toml       # Python project configuration
├── Dockerfile           # Multi-stage Docker build
└── README.md            # This file
```

## Architecture

```
Request → FastAPI Server
              │
              ├─→ /health, /ready → JSON response
              │
              ├─→ /ui/assets/* → Serve static file from /build/assets/
              │
              ├─→ /ui/* (file exists) → Serve static file
              │
              └─→ /ui/* (no file) → Serve index.html (SPA fallback)
```

## License

Private

