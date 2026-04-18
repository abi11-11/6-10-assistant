# Story 4.2: Maintain decision provenance and audit trail

Status: review

## Story

As a developer,
I want to ensure all mission logs and reviewer notes are part of the finding's audit trail,
so that conclusions are traceable to evidence.

## Acceptance Criteria

1. The finding's `description` (or a dedicated `audit_trail` field) should contain the history of mission outcomes and reviewer comments.
2. The UI should display the "Reviewer Decision" section clearly in the finding detail view.

## Tasks / Subtasks

- [x] Ensure `finalizeMission` and `reviewFinding` logic preserves historical context.
- [x] Update `InvestigationPage.tsx` to display the "Decision Record" if it exists.
