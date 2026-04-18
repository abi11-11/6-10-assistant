# Story E0.4: Test End-to-End Communication

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to test the connection between the frontend and backend,
so that we can verify the stack is working before feature development begins.

## Acceptance Criteria

1. **Given** both frontend and backend are running, **when** the frontend makes a request to a health-check endpoint on the backend, **then** it receives a successful response.

## Tasks / Subtasks

- [x] Create a health check component or service in the `6-10-assistant-ui`. (AC: 1)
- [x] Configure the UI to call the backend `/health` endpoint on startup or button click.
- [x] Display the connection status (Success/Failure) in the UI.
- [x] Verify the end-to-end flow manually by running both servers.

## Dev Notes

### Architecture Compliance
- **Communication:** Use the native `fetch()` client as mandated.
- **Proxy:** Ensure the Vite proxy configured in `E0.1` (`vite.config.ts`) is correctly routing `/api` calls to the backend.

### Project Structure Notes
- The test logic should be simple and easy to remove or repurpose later.
- Update `App.tsx` or create a `HealthCheck.tsx` component.

### References
- Architecture Document: [bmad-output/planning-artifacts/architecture.md]
- Epics: [bmad-output/planning-artifacts/epics-sharded/epic-0-project-foundation.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

### Review Findings

- [ ] [Review][Patch] Regression: Missing Search Input — The search input was accidentally removed from the `AppShell` header during the implementation.
- [ ] [Review][Patch] Style Consistency — The status indicator uses hardcoded hex colors (`#4caf50`, etc.) instead of CSS variables or the project's color tokens.
- [ ] [Review][Patch] Missing cleanup in useEffect — The `checkHealth` call in `App.tsx` doesn't have an `AbortController` or cleanup logic.
