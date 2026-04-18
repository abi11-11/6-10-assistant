# Story 2.2: Invoke mcp-style investigation tool through stable adapter

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to implement a stable adapter that can invoke investigation tools (simulated or real),
so that the agent can execute the planned mission.

## Acceptance Criteria

1. **Given** a mission proposal, **when** execution is triggered, **then** the system invokes the `DroneMissionTool`.
2. **Given** the `DroneMissionTool` is invoked, **when** the simulation runs, **then** it returns a `MissionResult` containing evidence for each checkpoint.
3. The execution must be exposed via a new API endpoint: `POST /findings/:id/mission/execute`.

## Tasks / Subtasks

- [x] Define the `InvestigationTool` and `MissionResult` interfaces. (AC: 1, 2)
- [x] Implement `DroneMissionTool` (simulated version).
- [x] Create the `POST /findings/:id/mission/execute` endpoint in `findings.ts`. (AC: 3)
- [x] Wire the UI's "Launch Mission" button (in the MissionPage) to call this endpoint.

## Dev Notes

### Architecture Compliance
- **Adapter Pattern:** Use a stable interface so we can swap the simulated drone for a real one later.
- **Location:** `6-10-assistant-api/src/services/drone-mission-tool.ts`.

### Project Structure Notes
- New file: `6-10-assistant-api/src/services/drone-mission-tool.ts`.
- Update: `6-10-assistant-api/src/handlers/findings.ts`.

### References
- Epics: [bmad-output/planning-artifacts/epics-sharded/epic-2-stable-investigation-and-persistence.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### Review Findings

- [ ] [Review][Patch] Missing Interval Cleanup in MissionPage.tsx: The simulation interval should be cleared on unmount or when `onBack` is called.
- [ ] [Review][Patch] Alert used for UI errors: The `alert()` call in `startSim` should be replaced with a status message in the UI.
- [ ] [Review][Patch] Inconsistent coordinate fallback: `cp.location?.x || cp.x` is used. Since the backend is now stable, we should normalize the checkpoint type.
- [x] [Review][Defer] Simulation timing is arbitrary — deferred, acceptable for MVP.

