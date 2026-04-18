## Epic 2: Confidence Refinement Through Evidence Expansion

Maya can strengthen, falsify, or clarify baseline findings through targeted digital evidence enrichment.

### Story 2.1: Detect Unresolved Questions and Plan Evidence Expansion

As Maya (Operations Lead),
I want the assistant to identify where confidence is insufficient and propose targeted evidence requests,
So that I do not manually hunt across systems to refine each hypothesis.

**Implements:** FR2

**Acceptance Criteria:**

**Given** baseline findings include unresolved questions
**When** the assistant evaluates investigation state
**Then** it generates targeted evidence expansion intents tied to specific hypotheses and uncertainty reasons
**And** each intent includes why existing evidence is insufficient for harmless, suspicious, or escalatable classification.

### Story 2.2: Invoke MCP-Style Investigation Tool Through Stable Adapter

As Maya (Operations Lead),
I want additional evidence to be gathered through a stable MCP-compatible adapter,
So that evidence enrichment is predictable and auditable.

**Implements:** FR3

**Acceptance Criteria:**

**Given** an evidence expansion intent is queued
**When** the assistant invokes the registered investigation tool
**Then** the tool is called through the MCP or MCP-style interface contract
**And** returned evidence includes event identifier, zone, time window, confidence metadata, and provenance.

### Story 2.3: Merge New Evidence and Recompute Finding Confidence

As Maya (Operations Lead),
I want refreshed evidence to update existing findings instead of creating disconnected analysis threads,
So that I can trust the confidence change and rationale evolution.

**Implements:** FR2, FR3

**Acceptance Criteria:**

**Given** new evidence is returned from MCP-backed enrichment
**When** the system reconciles evidence with existing findings and hypotheses
**Then** confidence scores and rationale are recalculated in place for affected findings
**And** the update history clearly indicates what evidence changed the confidence outcome.
