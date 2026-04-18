# Story 2.3: Merge new evidence and recompute finding confidence

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to merge mission results back into the finding and recompute the confidence score,
so that the investigation reaches a more stable state.

## Acceptance Criteria

1. **Given** a completed mission result, **when** the user clicks "Finalize", **then** the backend merges the observations into the finding record.
2. **Given** a merged mission, **when** confidence is recomputed, **then** the finding's `confidence` score increases (simulated boost of 5-10% per resolved question).
3. The finding's status must be updated to `READY_FOR_REVIEW` if it wasn't already.
4. The execution must be exposed via a new API endpoint: `POST /findings/:id/mission/finalize`.

## Tasks / Subtasks

- [x] Implement the `finalizeMission` logic in `InvestigationService`. (AC: 1, 2, 3)
- [x] Create the `POST /findings/:id/mission/finalize` endpoint in `findings.ts`. (AC: 4)
- [x] Update the UI (`MissionPage`) to show a "Finalize Analysis" button after the simulation ends.
- [x] Wire the "Finalize Analysis" button to call the API and navigate back to the investigation queue.

## Dev Notes

### Architecture Compliance
- **Persistence:** Ensure the `findingsRepository` is updated in memory (since we don't have a real DB yet).

### Project Structure Notes
- Update: `6-10-assistant-api/src/services/investigation-service.ts`.
- Update: `6-10-assistant-api/src/handlers/findings.ts`.
- Update: `6-10-assistant-ui/src/pages/MissionPage.tsx`.

### References
- Epics: [bmad-output/planning-artifacts/epics-sharded/epic-2-stable-investigation-and-persistence.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### Review Findings

- [ ] [Review][Patch] Mission Result Validation: Add a guard in `finalizeMission` to handle malformed mission results (missing outcomes).
- [ ] [Review][Patch] Potential Type Error in InvestigationPage: The `selected` variable can be undefined; add a null check for `selected.id` in the header or timeline.
- [ ] [Review][Patch] Random Question Slicing: Slicing the last question in `finalizeMission` is a placeholder; should eventually map results to specific questions.
- [x] [Review][Defer] Persistence is in-memory only — deferred, expected for MVP.

