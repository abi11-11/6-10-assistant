# Story 2.1: Detect unresolved questions and plan evidence expansion

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an investigator,
I want the system to identify the "Honest Uncertainty" questions in a finding and propose a plan to gather missing evidence,
so that the finding's confidence can be increased.

## Acceptance Criteria

1. **Given** a finding with `unresolved_questions`, **when** the investigation service is triggered, **then** it identifies specific evidence gaps.
2. **Given** those gaps, **when** the planning logic runs, **then** it generates a `MissionProposal` containing a list of `Checkpoints` and `ExpectedOutcomes`.
3. The proposal must be exposed via a new API endpoint: `GET /findings/:id/proposal`.

## Tasks / Subtasks

- [x] Define the `MissionProposal` schema in the backend. (AC: 1, 2)
- [x] Implement an `InvestigationService` that parses finding uncertainty.
- [x] Create the `GET /findings/:id/proposal` endpoint in `findings.ts`. (AC: 3)
- [x] Add unit tests for the proposal generation logic.
- [x] Wire the UI's "Deep Analysis" button to call this new endpoint.

## Dev Notes

### Architecture Compliance
- **Logic:** Keep the planning logic in a dedicated service, not the route handler.
- **Data:** For now, the "AI" planning can be template-based (mapping specific question keywords to checkpoints).

### Project Structure Notes
- New file: `6-10-assistant-api/src/services/investigation-service.ts`.
- Update: `6-10-assistant-api/src/handlers/findings.ts`.

### References
- Epics: [bmad-output/planning-artifacts/epics-sharded/epic-2-stable-investigation-and-persistence.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### Review Findings

- [x] [Review][Patch] Missing AbortController in AgentDrawer.tsx [AgentDrawer.tsx:24]
- [x] [Review][Patch] Hardcoded Coordinates in InvestigationService.ts [investigation-service.ts:47, 57, 67]
- [x] [Review][Patch] Fragile String Matching in planning logic [investigation-service.ts:45]
- [x] [Review][Patch] Handle Empty Unresolved Questions gracefully [investigation-service.ts:33]
- [x] [Review][Defer] Linear Confidence Delta calculation is simplistic — deferred, pre-existing pattern

