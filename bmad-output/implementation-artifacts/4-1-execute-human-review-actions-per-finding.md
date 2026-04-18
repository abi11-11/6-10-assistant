# Story 4.1: Execute human review actions per finding

Status: review

## Story

As a developer,
I want to persist human review actions (Approve/Reject/Refine) with rationale,
so that the site head can see accountable judgments.

## Acceptance Criteria

1. **Given** a finding, **when** a user submits a review via the `ReviewModal`, **then** the backend persists the status and decision details.
2. The finding state must update from `READY_FOR_REVIEW` to `APPROVED`, `REJECTED`, or `REQUIRES_REFINEMENT`.
3. The review must be exposed via `POST /api/findings/:id/review`.

## Tasks / Subtasks

- [x] Add `POST /findings/:id/review` endpoint in `findings.ts`.
- [x] Update `InvestigationPage.tsx` to call the API instead of just updating local state.
- [x] Update `ReviewModal.tsx` to handle the async submission state.
