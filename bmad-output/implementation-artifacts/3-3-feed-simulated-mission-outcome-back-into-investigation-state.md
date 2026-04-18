# Story 3.3: Feed simulated mission outcome back into investigation state

Status: done

## Acceptance Criteria
- [x] Link mission outcomes to originating finding.
- [x] Update confidence and status after mission completion.

## Completion Notes
- Implemented in `InvestigationService.finalizeMission` and `POST /findings/:id/mission/finalize`.
