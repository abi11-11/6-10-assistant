# 6:10 Assistant - Docker Setup

This project is fully containerized with Docker and Docker Compose for development and production.

## Quick Start

### Prerequisites
- Docker Desktop (v20.10+)
- Docker Compose (v2.0+)

### Setup

1. **Clone the environment configuration:**
   ```bash
   cp .env.example .env
   ```

2. **Start all services:**
   ```bash
   docker compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - API: http://localhost:3000
   - API Test Page: http://localhost:3000/test-page

### Common Commands

```bash
# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f api
docker compose logs -f ui
docker compose logs -f postgres

# Stop all services
docker compose down

# Stop and remove volumes (reset database)
docker compose down -v

# Rebuild services
docker compose build

# Rebuild specific service
docker compose build api

# Restart services
docker compose restart
```

## Architecture

### Services

#### PostgreSQL (`postgres`)
- Event store database
- Port: 5432
- Default credentials: `sky_user` / `sky_password_dev`
- Volume: `postgres_data` (persisted across restarts)

#### API (`api`)
- Node.js / Fastify backend
- Port: 3000
- Built from: `Dockerfile.api`
- Features:
  - Event sourcing with PostgreSQL
  - Hot reload in development mode (volume mount)
  - Health checks enabled
  - Non-root user execution
  - Graceful shutdown

#### UI (`ui`)
- React + Vite frontend
- Port: 80
- Built from: `Dockerfile.ui`
- Features:
  - Multi-stage build (optimized size)
  - Nginx reverse proxy with gzip compression
  - API proxy to backend
  - SPA routing support
  - Cache busting for assets
  - Health checks enabled

## Environment Variables

See `.env.example` for all available options:

- `DB_PASSWORD` - PostgreSQL password
- `NODE_ENV` - Node environment (development/production)
- `LOG_LEVEL` - API log level (debug/info/warn/error)
- `VITE_API_URL` - Frontend API URL

## Development

### Hot Reload
The API service includes a volume mount for `src/` directory, enabling hot reload with `npm run dev`:

```bash
# The API will automatically restart when you save files
docker compose logs -f api
```

### Running Tests

```bash
# API tests
docker compose exec api npm test

# UI tests
docker compose exec ui npm test

# Watch mode
docker compose exec api npm run test:watch
docker compose exec ui npm run test:watch
```

### Accessing the Database

```bash
# Connect to PostgreSQL with psql
docker compose exec postgres psql -U sky_user -d sky_assistant

# Or from your local machine if psql is installed
psql -h localhost -U sky_user -d sky_assistant
```

## Production Configuration

For production deployment:

1. Update `.env` with secure values:
   ```bash
   DB_PASSWORD=<secure-random-password>
   NODE_ENV=production
   LOG_LEVEL=warn
   ```

2. Build production images:
   ```bash
   docker compose build --no-cache
   ```

3. Deploy with production overrides:
   ```bash
   docker compose -f docker-compose.yml up -d
   ```

### Production Considerations
- Use environment variables from secure secrets management
- Run behind a reverse proxy (nginx/traefik) with SSL/TLS
- Implement database backups
- Monitor container health with orchestration tools (Kubernetes, Docker Swarm, etc.)
- Use non-root users (already configured)
- Implement rate limiting and authentication

## Troubleshooting

### Database Connection Errors
```bash
# Check database status
docker compose exec postgres pg_isready -U sky_user

# View database logs
docker compose logs postgres
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml or use:
docker compose up -d -p unique_name
```

### Build Failures
```bash
# Clean rebuild
docker compose down
docker system prune -a
docker compose build --no-cache
docker compose up -d
```

### API Not Starting
```bash
# Check API logs
docker compose logs api

# Verify database connection
docker compose exec api npm run dev
```

## Performance Tips

- Use `docker compose up -d` for background mode
- Prune unused images/containers: `docker system prune`
- Monitor resource usage: `docker stats`
- Use `.dockerignore` to exclude unnecessary files

## Security Notes

- Change default database password in `.env` for any non-development use
- Run containers as non-root users (already configured)
- Use secrets management for sensitive data in production
- Keep Docker and images up to date
- Scan images for vulnerabilities: `docker scout cves`
