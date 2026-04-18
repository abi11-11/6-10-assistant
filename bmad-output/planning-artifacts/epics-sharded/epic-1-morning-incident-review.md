## Epic 1: Morning Incident Review

Maya can understand what likely happened overnight and where to look first using a seeded, reviewable morning workspace.

### Story 1.1: Generate Seeded Overnight Findings

As Maya (Operations Lead),
I want the system to transform seeded overnight events into prioritized findings with draft hypotheses,
So that I can reach an initial, evidence-backed understanding quickly.

**Implements:** FR1, NFR1, NFR4

**Acceptance Criteria:**

**Given** a seeded overnight scenario fixture is available
**When** the morning investigation job runs
**Then** the system produces prioritized findings with supporting evidence references, open questions, and recommended next actions
**And** the initial queue contains no more than 5 findings with status and confidence visible for each item.

### Story 1.2: Render Morning Investigation Workspace

As Maya (Operations Lead),
I want a focused workspace with findings queue, map context, and evidence timeline,
So that I can inspect the initial narrative without switching tools.

**Implements:** FR4, NFR2, NFR3

**Acceptance Criteria:**

**Given** prioritized findings are available for a seeded scenario
**When** Maya opens the morning workspace
**Then** the findings queue, map panel, and evidence summary load in under 3 seconds on the target environment
**And** selecting a finding updates map focus and timeline context while preserving keyboard accessibility for core actions.

### Story 1.3: Provide Finding Drilldown and Uncertainty Visibility

As Maya (Operations Lead),
I want each finding to show rationale, confidence, and unresolved questions,
So that I can quickly decide which findings need deeper investigation.

**Implements:** FR1, FR4, NFR4

**Acceptance Criteria:**

**Given** a finding is selected in the morning workspace
**When** Maya opens the finding details
**Then** she can view linked evidence, hypothesis rationale, and explicit unresolved uncertainties
**And** the UI shows recommended next action and current confidence in a reviewable, non-ambiguous format.
