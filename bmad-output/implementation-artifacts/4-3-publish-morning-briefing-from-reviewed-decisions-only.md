# Story 4.3: Publish morning briefing from reviewed decisions only

Status: review

## Story

As a developer,
I want the morning briefing to only include findings that have been approved or refined,
so that the report is actionable and verified.

## Acceptance Criteria

1. The Briefing page should filter out `PENDING` or `READY_FOR_REVIEW` findings that haven't received a final decision.
2. The briefing should show "Action Recommended" based on the reviewer's rationale.

## Tasks / Subtasks

- [x] Update `BriefingPage.tsx` to filter findings based on status.
- [x] Add a "Final Decision" badge to each briefing item.
