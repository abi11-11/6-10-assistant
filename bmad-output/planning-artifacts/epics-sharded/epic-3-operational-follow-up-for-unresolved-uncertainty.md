## Epic 3: Operational Follow-Up for Unresolved Uncertainty

Maya can evaluate simulated operational intervention when remote evidence is still insufficient.

### Story 3.1: Generate Simulation-Only Follow-Up Mission Proposal

As Maya (Operations Lead),
I want the system to propose a follow-up mission only when remote evidence cannot close uncertainty,
So that operational intervention is justified and bounded.

**Implements:** FR5

**Acceptance Criteria:**

**Given** a finding remains unresolved after digital evidence enrichment
**When** Maya requests or accepts mission proposal generation
**Then** the system creates a simulation-only mission proposal with route, checkpoints, and target uncertainty
**And** the proposal states expected checks and predicted evidence return before any approval action.

### Story 3.2: Visualize Mission Route and Checkpoint Intent on Map

As Maya (Operations Lead),
I want to inspect mission path and checkpoint purpose in spatial context,
So that I can challenge weak plans before approving them.

**Implements:** FR5, FR4

**Acceptance Criteria:**

**Given** a mission proposal exists for a selected finding
**When** Maya opens mission simulation view
**Then** route geometry, checkpoints, and zone coverage are displayed on the map with linked rationale
**And** each checkpoint explains what uncertainty it is intended to resolve.

### Story 3.3: Feed Simulated Mission Outcome Back Into Investigation State

As Maya (Operations Lead),
I want simulated mission outcomes to update the same finding and hypothesis records,
So that operational follow-up remains part of one continuous investigation.

**Implements:** FR5

**Acceptance Criteria:**

**Given** a simulated mission run completes
**When** outcome evidence is returned
**Then** the system links mission outcomes to the originating finding and hypothesis
**And** confidence and recommended next action are updated without creating a parallel investigation context.
