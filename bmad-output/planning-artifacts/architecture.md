---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - 'd:\sky_drone_project\6-10_prd.txt'
  - 'd:\sky_drone_project\6-10_prd-validation-report.md'
  - 'd:\sky_drone_project\bmad-output\planning-artifacts\epics.md'
workflowType: 'architecture'
project_name: 'sky_drone_project'
user_name: 'ABI'
date: '2026-04-16'
sprintConstraint: '3-day MVP delivery'
optimizingFor: 'In-scope workflow delivery + interview readiness'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

#### Functional Requirements
The system implements a **seven-part investigation workflow**:

1. **FR1-Incident Analysis:** Transform seeded overnight events into prioritized findings with draft hypotheses, supporting evidence references, and open questions
2. **FR2-3-Evidence Expansion:** Deploy an intelligent agent that dynamically invokes investigation tools (via MCP or MCP-style adapter) to gather evidence addressing specific uncertainties
3. **FR4-Spatial Context:** Provide map and timeline interfaces showing event locations, movement paths, zones, and investigation coverage
4. **FR5-Operational Simulation:** Propose and simulate drone patrol missions with route, checkpoints, and predicted evidence return when digital investigation is insufficient
5. **FR6-Human Review:** Enable approve/reject/refine actions for every finding before publication with rationale capture and decision provenance
6. **FR7-Briefing Generation:** Produce evidence-traceable morning briefings composed only of reviewed findings, unresolved risks, and recommended actions

#### Non-Functional Requirements
- **NFR1 - Seeded Data Only:** 100% reliance on static test fixtures; no real data integrations
- **NFR2 - Performance:** <3 second load time for initial findings queue, map, and evidence panels on target environment
- **NFR3 - Accessibility:** Meet WCAG 2.1 AA for core morning workflow (findings review, map interaction, briefing approval)
- **NFR4 - Prioritization:** Maximum 5 prioritized findings in initial review queue for demo scenarios

### Scale & Complexity Assessment

**Project Complexity:** Medium-High
- AI reasoning agent with dynamic tool orchestration (not CRUD-based)
- Multi-phase investigation workflow requiring state transitions
- Spatial reasoning and geospatial visualization
- Human-in-the-loop approval gates
- Full audit trail and decision provenance requirements

**Primary Technical Domain:** Full-stack web application
- Frontend: React-based morning investigation workspace with map and timeline interfaces
- Backend: Agentic orchestration layer, investigation tool adapters, workflow state machine, briefing engine
- Data: Shared domain models (Finding, Evidence, Hypothesis, Mission, Decision, Briefing) with strong contracts

**Estimated Architectural Components:** 12-15 core modules across agent, backend services, and UI

### Technical Constraints & Dependencies

1. **Investigation Tool Integration Pattern:** Must define stable MCP or MCP-style adapter interface to prevent tool coupling
2. **Evidence Linkage:** Every evidence item must carry provenance metadata (source, zone, time window, confidence) for audit trails
3. **Hypothesis Representation:** Findings must explicitly surface unresolved questions; confidence changes must be traceable
4. **Spatial Coordination:** Map visualization must correlate events, zones, and simulated mission paths correctly
5. **Seeded Data Contract:** All scenarios must be self-contained in static fixtures; no external service dependencies

### Cross-Cutting Concerns Identified

**Domain Models (Span all epics):**
- Finding: incident summary with status, confidence, rationale, recommended action, linked evidence references
- Evidence: observation with source, event ID, zone, time window, confidence metadata, provenance
- Hypothesis: candidate explanation linking findings and evidence with explicit unresolved questions
- Mission: simulated patrol with route, checkpoints, target uncertainty, expected checks, predicted evidence return
- Decision: human-reviewed outcome (approve/reject/refine) with reviewer rationale
- Briefing: publication-ready summary from reviewed decisions only

**Evidence Chain (Epic 2→3→4):**
- Digital evidence enrichment (Epic 2) feeds into simulated follow-up requests (Epic 3)
- Simulated mission outcomes update the same finding/hypothesis (not parallel threads)
- All evidence collected routes through human review before publication (Epic 4)

**Uncertainty Representation (Core to Epics 2, 3, 4):**
- Initial findings must explicitly state unresolved questions (not hide them)
- Investigation tools must gather evidence *targeting specific uncertainties*, not generic data
- Simulated missions are only proposed when remote evidence is insufficient
- Briefing must include unresolved risks, not just approved findings

**Review & Approval (Epic 4 gates all output):**
- No finding is included in briefing without explicit human review action (approve/reject/refine)
- Full decision provenance required: evidence lineage, confidence changes, reviewer overrides
- Decision audit trail must persist with briefing generation

### Architectural Reasoning Paths Explored

Three core orchestration approaches were evaluated:

1. **Agent-Centric:** Central agent controls entire workflow (natural for FR2, but single point of failure)
2. **Event-Driven:** Immutable event streams + fact database (strongest audit trail, but complex state modeling)
3. **Workflow-Centric:** Epic-aligned state machine (clear phases, but less flexible)

**Selected Hybrid: Agent-Centric + Event-Driven**

The system uses a **phased agent orchestration** model:
- Agent maintains unified reasoning context within investigation phases (matching epics 1→2→3→4)
- Every agent action emits immutable events (ConfidenceChanged, MissionProposed, DecisionMade)
- Events populate a fact database queryable by review layer (FR6)
- Perfect audit trail without burdening core agent logic
- Enables replay/debugging and separation of concerns

**Key Architectural Implications:**

1. **Agent Boundary:** Investigation orchestrator (agent) remains stateless between decision cycles; all context preserved in queryable fact database
2. **Event Contract:** Define standard event types (IncidentIngestedEvent, EvidenceGatheredEvent, ConfidenceChangedEvent, MissionProposedEvent, DecisionMadeEvent, BriefingPublishedEvent)
3. **Phase Separation:** Agent works within phase boundary; explicit phase transitions prevent investigation cycles
4. **Review Hook:** Review layer queries event lineage for any finding, reconstructing full evidence chain and reasoning trail

### Architectural Risks Identified (And Validation Points)

1. **Agent Context Window:** Long investigations may exceed token limits — mitigate by checkpointing phase state
   - *Validation:* Story 2.1 must include context budget acceptance test: "Given 5 findings with unresolved questions, when agent runs evidence expansion, then context utilization stays below 70% of token budget"

2. **Investigation Cycles:** Risk of evidence→mission→evidence→mission loops — mitigate with explicit phase gates and loop detection
   - *Validation:* Define agent stopping rule per story. Story 2.1: "What ends evidence expansion?" (Max attempts? User decision? Confidence threshold?)

3. **Tool Failure Coupling:** Tool invocation failure propagates to agent reasoning — mitigate with graceful degradation and evidence enrichment status tracking
   - *Validation:* Story 2.2 must include tool failure fallback acceptance criteria and recovery strategy

4. **Review Bottleneck:** Phase 4 (Epic 4) becomes serial gate for all findings — mitigate with parallel review UI and async decision capture
   - *Validation:* Story 4.1 must define latency SLA per approval action (target: <500ms per finding, <60s total for 5 findings)

5. **Finding Authority Ambiguity:** Agent computes confidence in Story 2.3; Maya overrides in Story 4.1. Which is authoritative?
   - *Validation:* Architecture Decision Record required before implementation. Domain model must clarify: Is Finding.confidence the source of truth, or the event log?

6. **Investigation State Machine Implicit:** Epics describe phases, but no explicit state guard prevents cross-phase violations
   - *Validation:* Story acceptance criteria must include state transition guards (e.g., "Cannot trigger Story 3.1 mission if Finding.status != EVIDENCE_EXPANSION_COMPLETE")

### Alignment with Epic Structure

- **Epic 1 (Morning Review):** Phase 1 generates initial findings
- **Epic 2 (Evidence Expansion):** Phase 2 refines hypotheses through tool invocation
- **Epic 3 (Follow-Up Simulation):** Phase 3 proposes/simulates missions when evidence is insufficient
- **Epic 4 (Review & Briefing):** Phase 4 applies human review, generates publication-ready briefing from approved findings

This alignment ensures AI agents implementing each epic remain architecturally coherent.

### Roundtable Validation Notes

**From developer perspective (Amelia):**
- Three implementation gaps identified: context budget test, state machine guard, tool failure fallback
- All three must be wired into story acceptance criteria before development starts
- Resolution: ADR on event-sourcing authority (agent context vs. event log) required by Story 4.2

**From business perspective (Mary):**
- Three pressure tests to clarify assumptions: agent stopping rule, event trail visibility, Raghav's context integration
- Core question: Is event-driven audit trail a business win (builds Maya's trust) or compliance overhead?
- Event trail is genuine win *if* review UI prominently features it as trust-builder; otherwise infrastructure only

**From UX perspective (Sally):**
- Phased workflow maps well to Maya's cognitive load and time pressure
- Critical risk: Audit trail can become noise in UI if not properly translated to narrative summaries
- Recommendation: Prototype review screen (Epic 4 UX) immediately—that's the make-or-break point
- Review interface must translate transparency into confidence, not into cognitive overhead

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application: Agentic orchestration backend + React spatial frontend

### Starter Options Considered

**Option 1: Fastify + Emmett + Vite (Selected)**
- **Fastify** (v5.8.5): High-performance Node.js framework with 77k req/s throughput; async-first design; TypeScript native
- **Emmett**: Event-driven library with PostgreSQL event sourcing built-in; domain event-first architecture
- **Vite** (v8.0.8): Lightning-fast frontend bundler; React + TypeScript templates; 104M weekly downloads

**Option 2: Express + TypeORM + Vite (Alternative)**
- Simpler, more pragmatic approach
- Express familiar to most teams
- Would require manually implementing event sourcing patterns
- Better for teams unfamiliar with event-driven architecture

### Selected Starter: Fastify + Emmett + Vite

**Rationale for Selection:**

Event sourcing is *native* to Emmett, not bolted-on. This directly aligns with the hybrid architecture (Step 2) that combines agent-centric reasoning with event-driven audit trails:
- Fastify's async-first patterns fit agentic orchestration naturally
- Emmett's PostgreSQL event store natively supports Finding/Evidence/Hypothesis/Decision domain models
- Event stream is automatic audit trail for review layer (FR6 requirement)
- TypeScript throughout enables consistent implementation across frontend, backend, and AI agents
- Clear self-hosted MVP → AWS production scaling path
- No hidden framework opinions—you control structure

**Initialization Commands:**

Frontend (Vite + React + TypeScript):
```bash
npm create vite@latest 6-10-assistant-ui -- --template react-ts
cd 6-10-assistant-ui
npm install
npm run dev  # Starts on http://localhost:5173
```

Backend (Fastify + Emmett + PostgreSQL):
```bash
# Clone Emmett official PostgreSQL starter
git clone https://github.com/event-driven-io/emmett-starter-postgresql.git 6-10-assistant-api
cd 6-10-assistant-api
npm install

# Create PostgreSQL database locally
# Create environment: .env.local
# DATABASE_URL=postgres://user:password@localhost:5432/6-10-assistant

npm run dev  # Starts Fastify on http://localhost:3000
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript 5.x strict mode
- Node.js 20+ (LTS)
- ES modules (import/export)
- Node.js built-in test runner (optional)

**Frontend Architecture (Vite):**
- React 18 with Hooks
- React Router for SPA navigation
- Vite HMR for instant refresh during development
- CSS Modules or Tailwind CSS support
- Vitest for unit testing
- Built-in ESM bundling

**Backend Architecture (Fastify + Emmett):**
- Domain events as first-class citizens (not data tables)
- PostgreSQL as immutable event log storage
- Async/await handler model (no callbacks)
- Request-level context propagation (dependency injection)
- Pino structured JSON logging
- Auto-generated TypeScript types from events
- Hook-based middleware pattern

**Database Design:**
- PostgreSQL event store schema (auto-created by Emmett)
- Immutable event versioning
- Snapshot support for performance
- Transaction-safe event appending
- Native JSON support for event payloads

**Development Experience:**
- `npm create vite` for React TypeScript setup (0-config)
- Fastify hot reload without process restart
- TypeScript strict checking by default
- Structured logging with Pino
- Built-in connection pooling
- Test infrastructure included

**Build & Production:**
- Vite production build (tree-shaking, minification, chunk splitting)
- Node.js production start via `npm start`
- Docker-ready (multi-stage build)
- Environment variable support (.env, .env.local)

**Initial Project Structure:**

```
6-10-assistant/
├── 6-10-assistant-ui/                 # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/                # React components
│   │   ├── pages/                     # Page-level components
│   │   ├── services/                  # API client, state management
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── 6-10-assistant-api/                # Backend (Emmett + Fastify)
    ├── src/
    │   ├── domain/                    # Domain events (Finding, Evidence, etc.)
    │   ├── projections/               # Read models built from events
    │   ├── handlers/                  # API route handlers
    │   ├── migrations/                # Database schema migrations
    │   └── app.ts                     # Fastify server setup
    ├── database/
    │   └── event-store/               # Event store config
    ├── .env.example
    ├── tsconfig.json
    └── package.json
```

**Critical First Stories (Initialization):**

Story E0.1: Set up frontend scaffolding (Vite + React)
Story E0.2: Set up backend scaffolding (Fastify + Emmett)
Story E0.3: Create PostgreSQL database and event store schema
Story E0.4: Test end-to-end communication (fetch from frontend to backend)

**Note on Event Sourcing Learning:** 
This starter puts event sourcing front-and-center. If your team is unfamiliar with the pattern, budget time for learning before Epic 1 implementation. The payoff is massive for your use case (perfect audit trails, investigation replay, confidence lineage).

## Core Architectural Decisions (3-Day Sprint)

### Decision Framework & Constraints

**Sprint Goal:** Deliver 6 in-scope requirements with production-ready interview-prep code.

**Optimizing For:**
- AI-first investigation workflow (core value)
- Evidence chain integrity (required for review layer)
- Simple, explainable decisions (for 3-day delivery)
- Interview readiness (document tradeoffs explicitly)

**Out of Scope (Explicitly):**
- Real drone integration, live video, image processing, 3D mapping
- Actual sensor integrations, physics-heavy simulation, multiplayer
- Production auth (will use simplified approach)
- Advanced state management (React Query handles what we need)

### Decision 1: API Communication Pattern

**Decision:** REST API with Fastify route handlers

**Rationale:**
- Fastify excels at simple HTTP routing
- Native `fetch()` in React (no GraphQL client needed)
- Request/response contract is explicit and auditable
- 3-day sprint: no learning curve

**Technical Approach:**
- Endpoints organized by domain:
  - `POST /investigations` - Start investigation from seeded incidents
  - `GET /findings` - List findings in priority order
  - `GET /findings/{id}` - Single finding with evidence lineage
  - `POST /findings/{id}/review` - Maya's approve/reject/refine action
  - `GET /briefing` - Generate morning briefing from approved findings
  - `POST /missions` - Request mission proposal
  - `GET /missions/{id}/simulate` - Simulate mission outcome

**What This Enables:**
- Clear request/response contracts (for AI agents reading code)
- Event flow is visible in HTTP actions
- Investigation state progresses through clear endpoints

---

### Decision 2: Request/Response Validation

**Decision:** Fastify built-in JSON Schema validation

**Rationale:**
- Zero-dependency validation
- Automatic 400 Bad Request responses for schema mismatches
- Pairs perfectly with Fastify's validator plugin
- Compiled schemas = fast validation

**Validation Points:**
- Request body (Finding updates, review actions, mission parameters)
- Query parameters (user identity, status filters)
- Response serialization (ensures events are valid before transport)

**Interview Prep Answer:**
Q: "What did you ignore?"
A: "Production auth. Hardcoded user role based on query param (`?user=maya`). Validation catches malformed data at HTTP boundary, but we skip JWT/OAuth to stay focused on investigation workflow."

---

### Decision 3: User Identity & Authorization (MVP)

**Decision:** Hardcoded user roles via query parameter + role-based endpoint checks

**How It Works:**
```typescript
// Backend: Extract user from request
const getUserRole = (request: FastifyRequest): 'operations_lead' | 'site_head' => {
  const role = request.query.user === 'nisha' ? 'site_head' : 'operations_lead';
  return role;
}

// Every event records user identity
event.recordedBy = getUserRole(request);
event.timestamp = new Date();

// Authorization hooks check role
fastify.post('/findings/:id/review', {
  preHandler: async (request) => {
    const role = getUserRole(request);
    if (role !== 'operations_lead' && role !== 'site_head') {
      throw new Error('Unauthorized');
    }
  },
  handler: async (request, reply) => {
    // Process review action
  }
});
```

**Why This for 3 Days:**
- Eliminates JWT infrastructure (2-4 hours saved)
- Still records decision provenance (required for Epic 4)
- User identity in every event (enables audit trail)
- Can upgrade to real auth before production

**Interview Prep Answer:**
Q: "What did you simplify?"
A: "Authentication. Used URL parameter to identify user instead of JWT tokens. This eliminated session/token management but kept decision provenance. In production, would implement JWT or OAuth."

---

### Decision 4: Frontend State Management

**Decision:** React Query for server state + local `useState` for UI state

**Why:**
- React Query handles fetching, caching, refetching
- No need for Redux/Zustand for MVP scope
- Pairs naturally with REST API
- Built-in loading/error states for findings, missions, etc.

**Pattern:**
```typescript
// Fetch findings with automatic caching
const { data: findings, isLoading } = useQuery({
  queryKey: ['findings'],
  queryFn: () => fetch('/findings?user=maya').then(r => r.json())
});

// Local UI state (expanded finding, map zoom)
const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
const [mapZoom, setMapZoom] = useState(1);
```

**What This Buys:**
- Automatic refetching when findings update
- Background refetch on window focus
- Stale-while-revalidate patterns work out of the box
- Clean separation: server state vs UI state

---

### Decision 5: Investigation Loop Architecture (Core Loop)

**This is the answer to: "How does the system decide what to do? What is the loop?"**

**The Investigation Loop (Runs on Backend, Epics 1→3):**

```
START Investigation

For each Finding:
  1. Load Finding + Evidence + Hypothesis
  
  2. Agent evaluates: "Are questions resolved?"
     ├─ Does confidence ≥ threshold (e.g., 0.85)?
     │  └─ YES: Finding is RESOLVED → skip to step 5
     │  
     ├─ NO: Unresolved questions detected
     │  └─ Emit: UnresolvedQuestionsFound event
     
  3. Agent decides: "What evidence would help?"
     ├─ Invoke MCP tool adapter
     │  └─ Tool returns: Evidence objects (zone, time, confidence)
     │  
     ├─ Merge evidence into Finding
     │  └─ Recompute confidence
     │  └─ Emit: EvidenceGathered + ConfidenceChanged events
     
  4. Agent evaluates again: "Confidence now sufficient?"
     ├─ YES (≥ 0.85): Finding RESOLVED → skip to step 5
     │  
     ├─ NO: Confidence still low
     │  └─ Agent decides: "Can mission simulation help?"
     │  └─ Generate mission proposal (route, checkpoints, predicted evidence)
     │  └─ Simulate mission outcome
     │  └─ Merge simulated evidence
     │  └─ Recompute confidence one more time
     │  └─ Emit: MissionProposed + MissionOutcome events
     
  5. Finding reaches review queue
     ├─ Status: READY_FOR_REVIEW
     ├─ Case 1: Confidence ≥ threshold (high confidence)
     │  └─ Maya likely approves
     ├─ Case 2: Confidence < threshold (uncertain)
     │  └─ Maya sees unresolved questions, evidence lineage
     │  └─ May drill down or request more evidence (out of scope for MVP)

END Investigation Loop

Human Review Phase (Epic 4):
  For each Finding in review queue:
    Maya: approve / reject / refine
    ├─ Emit: DecisionMade event (includes reviewer ID, rationale)
    └─ Finding moves to: APPROVED / REJECTED / REFINED

Briefing Generation:
  Generate briefing from APPROVED + REFINED findings only
  ├─ Include unresolved uncertainties
  ├─ Include recommended actions
  ├─ Include decision lineage (who approved, when)
  └─ Return to Nisha at 8:00 AM equivalent
```

**Key Design Decisions:**
- Loop is **synchronous** (not concurrent) — findings investigated one at a time
- Loop is **single-pass** — no re-looping after human review
- **Unresolved questions are explicit** — not hidden, visible to Maya
- **Evidence gathering is optional** — agent decides if evidence is needed
- **Mission simulation is optional** — agent decides if drone follow-up is justified

**What Happens When Agent Is Uncertain:**
1. Confidence < threshold after evidence gathering
2. Agent decides: mission sim could help
3. Mission simulated (predicted evidence locations, expected observations)
4. Outcome merged; confidence updated
5. If still uncertain: Finding goes to review with confidence + unresolved questions visible
6. Maya makes final call: approve despite uncertainty, reject, or refine

**Interview Prep Answer:**
Q: "What does the system do when it's not sure?"
A: "Agent surfaces uncertainty explicitly: shows confidence score, displays unresolved questions, and optionally proposes mission simulation. Uncertain findings still reach human review, but flagged as low-confidence. Maya sees the evidence chain and makes the final decision."

---

### Decision 6: MCP Tool Integration (Stub Approach)

**Decision:** Local MCP tool stub with seeded evidence data

**Why This for 3 Days:**
- Demonstrates tool integration pattern without external service dependency
- Shows you understand MCP protocol concept
- Fully controllable for demo scenarios
- Can swap real tool later

**Implementation:**

```typescript
// MCP Tool Interface (defined locally)
interface MCPToolInput {
  findingId: string;
  zone: string;
  timeWindow: { start: Date; end: Date };
  uncertaintyType: 'threat_level' | 'location' | 'timing' | 'identity';
}

interface MCPToolOutput {
  evidence: Array<{
    eventId: string;
    source: 'camera' | 'badge_reader' | 'fence_sensor' | 'zone_transit';
    zone: string;
    timestamp: Date;
    confidence: number;
    description: string;
  }>;
}

// Tool Adapter (calls stub implementation)
const mcp_investigation_tool = async (input: MCPToolInput): Promise<MCPToolOutput> => {
  // In real system: fetch from actual MCP server
  // For MVP: return seeded data based on input
  
  // Seeded evidence scenarios:
  const scenarios = {
    'zone-A-threat': [
      { eventId: 'CAM-001', source: 'camera', zone: 'A', confidence: 0.92, ... },
      { eventId: 'BADGE-001', source: 'badge_reader', zone: 'A', confidence: 0.78, ... }
    ],
    // ... more scenarios
  };
  
  const scenarioKey = `${input.zone}-${input.uncertaintyType}`;
  return { evidence: scenarios[scenarioKey] || [] };
}
```

**Interview Prep Answer:**
Q: "What did you fake?"
A: "MCP tool is a local stub returning seeded evidence. In production, this would be a real gRPC or REST service. I prioritized demonstrating the integration pattern over actual external tools to stay focused on the investigation workflow."

---

### Decision 7: Spatial Interface (SVG Canvas)

**Decision:** Custom SVG canvas + simple pan/zoom (no mapping library)

**Why:**
- No dependency bloat (Leaflet/Mapbox add 100KB+)
- Full control over interaction
- Can implement in <4 hours
- Meets "meaningful spatial interface in workflow"

**What It Shows:**
1. Event locations plotted as circles
   - (zone, time) mapped to (x, y) coordinates
   - Color indicates severity (red=high, yellow=medium, green=low)
   - Size indicates confidence

2. Mission route as a line
   - Starting point → checkpoint 1 → checkpoint 2 → end
   - Shows coverage area (zone boundaries)
   - User can visually verify if mission makes sense

3. Interactive features
   - Click finding box to highlight on map
   - Drag to pan
   - Scroll to zoom in/out
   - Tooltip shows event details on hover

**Implementation:**
```tsx
// Simplified SVG rendering
<svg width="800" height="600" style={{ border: '1px solid #ccc' }}>
  {/* Grid/zones background */}
  <g opacity="0.1">
    <rect x="0" y="0" width="200" height="600" fill="gray" />
    <text x="10" y="30">Zone A</text>
    {/* ... more zones */}
  </g>
  
  {/* Events as circles */}
  {findings.map(f => (
    <circle 
      cx={f.location.x} 
      cy={f.location.y} 
      r={f.confidence * 30} 
      fill={confidenceToColor(f.confidence)}
      onClick={() => setSelectedFinding(f)}
    />
  ))}
  
  {/* Mission route as polyline */}
  {mission && (
    <polyline 
      points={mission.route.map(p => `${p.x},${p.y}`).join(' ')} 
      stroke="blue" 
      fill="none" 
      strokeWidth="2"
    />
  )}
</svg>
```

**Interview Prep Answer:**
Q: "What did you ignore?"
A: "Advanced mapping features. Used SVG canvas instead of GIS library (Leaflet/Mapbox) to eliminate dependencies. Shows event locations and mission routes visually but doesn't have real satellite imagery or complex spatial queries. Sufficient for MVP workflow."

---

### Decision 8: Mission Simulation (Lightweight)

**Decision:** Simple route + predicted evidence generation (no physics engine)

**How It Works:**

```
User selects Finding with low confidence

System generates route:
  ├─ Start: Facility entrance
  ├─ Checkpoints: [zones where unresolved questions exist]
  └─ End: Facility entrance

System predicts expected evidence:
  ├─ "Zone B camera should capture perimeter motion"
  ├─ "Badge reader at gate will show employee passage"
  └─ Confidence boost estimates: +0.15 to +0.25

Display on UI:
  ├─ Route visualized on map
  ├─ Checkpoint purposes clear ("verify fence integrity")
  └─ Predicted evidence listed

User clicks "Approve Mission":
  ├─ Simulate evidence gathering (seeded outcomes)
  ├─ Update finding confidence
  ├─ Emit: MissionOutcome event
  └─ Loop back to human review
```

**NOT Including:**
- Flight dynamics or physics
- Realistic drone navigation
- Obstacle avoidance, wind, battery life
- 3D visualization

**Why This Scope:**
- Demonstrates "drone follow-up decision" concept
- Realistic enough for demo (routes make sense)
- Fake outcomes show how evidence feeds back into investigation
- Can be enhanced post-MVP with real simulation

**Interview Prep Answer:**
Q: "What did you simplify?"
A: "Mission simulation. Generated simple routes (visit suspicious zones) and seeded predicted outcomes instead of physics-based flight simulation. Sufficient to show how operational follow-up would work."

---

### Decision 9: Incident Data & Seeding

**Decision:** All data comes from static seeded fixtures

**Rationale:**
- No external API dependencies
- Fully reproducible (same demo every time)
- Meets NFR1: "Rely entirely on seeded data"
- Fast iteration (no database setup wait times)

**Seeded Scenarios:**

```
Scenario 1: "False Alarm"
  ├─ Fence alert at zone A (low confidence)
  ├─ Badge reader shows no intrusion
  ├─ Confidence increases to high
  └─ Finding: HARMLESS

Scenario 2: "Suspicious Activity"
  ├─ Multiple fence alerts + badge failure
  ├─ Evidence suggests possible intrusion
  ├─ Mission simulation proposed
  ├─ Simulated drone finds nothing
  └─ Finding: UNRESOLVED (needs escalation)

Scenario 3: "Routine Staff Activity"
  ├─ Late-night badge usage (expected)
  ├─ Events match known schedule
  ├─ High confidence
  └─ Finding: HARMLESS
```

**How Stored:**
```typescript
// src/seeds/investigations.ts
export const seedInvestigations = [
  {
    id: 'demo-scenario-1',
    overnight_date: '2026-04-16',
    incidents: [
      { timestamp: '2026-04-16T23:15:00', zone: 'A', type: 'fence_alert', severity: 0.6 },
      { timestamp: '2026-04-16T23:16:00', zone: 'A', type: 'badge_failure', severity: 0.4 },
      // ... more incidents
    ]
  }
];

// API loads seeded scenarios on demand
GET /investigations?scenario=demo-1
```

---

### Decision 10: Error Handling & System Failure Modes

**Question: "Give one example where your system could be wrong. What happens then?"**

**Example Failure Mode:**
Agent computes high confidence that activity is "harmless" but human reviewer discovers it's actually suspicious after seeing video context Maya has outside the system.

**How System Handles This:**
1. Maya clicks "reject" or "refine" in review interface
2. She adds rationale: "Actually suspicious based on video footage"
3. System records: `DecisionMade { action: 'reject', reviewer_rationale: '...', timestamp: ..., user_id: 'maya' }`
4. Finding stays out of briefing
5. Escalation recommended in briefing: "See notes for escalated findings"

**What This Shows:**
- Humans are the authority (Epic 4: review layer gates everything)
- Agent decisions are recommendations, not verdicts
- Full audit trail means mistakes are traceable
- No finding reaches Nisha without explicit human decision

**Interview Prep Answer:**
Q: "Give one example where your system could be wrong. What happens then?"
A: "Agent might misclassify an event as harmless when it's actually suspicious. This is why Epic 4 (review layer) requires explicit human approval for every finding. Maya sees the evidence chain, agent reasoning, and confidence score. She can reject the finding with rationale. The decision is recorded, and the finding is excluded from the briefing. This design ensures no AI decision reaches the leadership briefing without human validation."

---

### Summary: 3-Day Architecture Map

| Component | Technology | Decision | Why |
|-----------|-----------|----------|-----|
| Frontend | React 18 + Vite | REST client + React Query | Simple, no learning curve |
| Backend | Fastify v5.8.5 | REST API + Emmett events | Event sourcing native; fast |
| Database | PostgreSQL | Event store | Immutable audit trail |
| Validation | Fastify JSON Schema | Request/response contracts | Built-in, fast |
| Auth | Query param (MVP) | Hardcoded user role | 0 complexity; can upgrade later |
| State Mgmt | React Query + useState | Server state + UI state | Clean separation |
| Investigation | Synchronous agent loop | Single-pass (no re-loop) | Predictable, auditable |
| MCP Tool | Local stub | Seeded evidence returns | Demonstrates pattern without external dependency |
| Map | SVG canvas + custom | No mapping library | Under 4 hours, no bloat |
| Mission Sim | Route + predicted evidence | No physics engine | Lightweight, shows concept |
| Data | Seeded fixtures | Static scenarios | No API dependency; fully reproducible |

---

### Interview Prep Answers (Complete)

**Q. How did you approach the problem?**
A. I broke it into two parallel tracks: (1) Agentic investigation workflow (agent decides what to investigate, when to gather evidence, when to propose missions), and (2) Human review layer (Maya approves/rejects findings before they reach Nisha). I chose event sourcing as the backbone to guarantee audit trails and investigation replay. Then I ruthlessly scoped the MVP to the 6 in-scope requirements, cutting authentication, 3D mapping, physics simulation, and other "nice-to-haves" that would consume the 3-day deadline.

**Q. What did you optimize for?**
A. (1) Delivering the core AI-first investigation workflow, (2) Evidence chain integrity for the review layer, and (3) Interview readiness (explicit documentation of tradeoffs). I avoided perfectionism; chose simple technologies (REST, React Query, SVG) that let me ship the workflow fast.

**Q. What did you ignore?**
A. Production auth (used URL parameter instead of JWT), realistic physics (mission sim predicts evidence rather than simulating drone flight), real MCP tools (stubbed locally with seeded data), 3D mapping (used SVG canvas), image processing, live video, actual sensor integrations. All explicitly deferred or faked to stay within scope.

**Q. How does your system work end-to-end?**
A. Overnight incidents seed an investigation. Agent evaluates each finding: Does it have unresolved questions? If yes, invoke MCP tool for evidence. Confidence increases. If still uncertain, propose mission simulation. Once agent loop completes, Maya reviews findings in Epic 4. She approves, rejects, or refines each one. Only approved findings reach the briefing. Nisha sees a morning summary with evidence lineage and unresolved risks.

**Q. How does the system decide what to do? What is the loop?**
A. Agent loop: (1) Load finding + evidence, (2) Evaluate confidence against threshold, (3) If unresolved: invoke MCP tool, merge evidence, recompute, (4) If still uncertain: propose mission simulation, simulate outcome, merge predicted evidence, recompute, (5) Finding goes to review. Loop is synchronous, single-pass. No re-looping after human review. Human review loop: Maya approves/rejects/refines each finding. Approved findings compose the briefing.

**Q. What does the system do when it's not sure?**
A. Agent surfaces uncertainty explicitly. Confidence score visible, unresolved questions listed. Confidence < threshold? Mission simulation proposed. If confidence still low after sim: finding goes to review flagged as uncertain. Maya sees evidence chain and makes final call. Uncertain finding not included in briefing unless Maya explicitly approves despite uncertainty.

**Q. Tradeoffs: What did you simplify, skip, or fake?**
A. Simplified: Auth (hardcoded user parameter), state management (React Query instead of Redux), mission planning (simple route instead of pathfinding). Skipped: JWT/OAuth, 3D mapping, physics engine, image processing, real MCP services. Faked: MCP tool (local stub), seeded evidence scenarios (all data static), drone flight simulation. Each choice traded "production-ready" for "3-day delivery."

**Q. How did you use AI tools while building?**
A. Used Claude for: (1) Architecture design (Tree of Thoughts to explore orchestration patterns), (2) Code generation for Fastify routes and React components, (3) Test fixture generation (seeded incident scenarios), (4) Documentation (API contracts, interview prep). AI accelerated boilerplate but I drove all architectural decisions and investigated tradeoffs myself.

**Q. If you had 1 more week, what would you improve?**
A. (1) Real MCP tool integration (connect to actual evidence service), (2) Authentication (JWT tokens), (3) Mission planning (route optimization, actual checkpoint pathfinding), (4) Spatial UI (Leaflet.js for real GIS, satellite imagery), (5) Confidence models (Bayesian inference instead of heuristic threshold), (6) Investigation loops that allow Maya to re-trigger evidence gathering mid-review (out of scope now), (7) Performance profiling (investigate query latency under load), (8) Comprehensive testing (E2E tests for investigation loops).
