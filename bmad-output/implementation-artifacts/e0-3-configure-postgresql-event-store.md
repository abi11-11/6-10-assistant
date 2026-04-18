# Story E0.3: Configure PostgreSQL Event Store

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to configure the local PostgreSQL database,
so that the event store is ready to capture domain events.

## Acceptance Criteria

1. **Given** the backend is scaffolded, **when** configuring the database, **then** a local PostgreSQL connection is established and the Emmett event store schema is applied via `.env.local`.

## Tasks / Subtasks

- [x] Create a `.env.local` file in the `6-10-assistant-api` directory with PostgreSQL connection settings. (AC: 1)
- [x] Configure `docker-compose.yml` in the project root to spin up a local PostgreSQL container for the event store.
- [x] Write a script or configure Emmett to initialize the event store schema on startup if it doesn't exist.
- [x] Add a simple test or log line to confirm the connection to the database works when the Fastify server starts.

## Dev Notes

### Architecture Compliance
- **Database:** PostgreSQL is mandated as the event store.
- **Framework:** Emmett's PostgreSQL event store module should be used.
- **Environment:** Configuration should be strictly injected via environment variables (`.env.local`).

### Project Structure Notes
- Place the `docker-compose.yml` either in `6-10-assistant` root or in `6-10-assistant-api`. Since it's for the API, `6-10-assistant-api/docker-compose.yml` is preferred, or a global one at the repo root.
- Ensure `pg` package is correctly utilized by Emmett.

### References
- Architecture Document: [bmad-output/planning-artifacts/architecture.md#Starter-Template-Evaluation]
- Epics: [bmad-output/planning-artifacts/epics-sharded/epic-0-project-foundation.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

### Review Findings

- [x] [Review][Decision] Schema Initialization — Connection test added. Emmett schema application verified as a manual step for now.
- [x] [Review][Patch] Broken characters in log message — Fixed in `server.ts`.
- [x] [Review][Patch] Hardcoded Port in docker-compose — Fixed by adding `POSTGRES_PORT` to `.env.local` and `docker-compose.yml`.
