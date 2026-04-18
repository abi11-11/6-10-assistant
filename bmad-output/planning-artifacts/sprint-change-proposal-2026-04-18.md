# Sprint Change Proposal: Missing Project Initialization Stories

## 1. Issue Summary
During the Implementation Readiness check, it was discovered that the current epics omit the foundational initialization stories required by the Architecture Document. Specifically, the architecture mandates using the Fastify + Emmett + Vite starter templates (stories E0.1 - E0.4), but Epic 1 currently jumps straight into feature work. 

## 2. Impact Analysis
- **Epic Impact**: Epic 1 cannot be started without the repository scaffolding. A new epic is required.
- **Story Impact**: New foundational stories (E0.1-E0.4) must be introduced to guide the developer agent.
- **Artifact Conflicts**: This change resolves a conflict between the Epics and the Architecture Document. PRD and UX are unaffected.
- **Technical Impact**: Ensures the development agents set up the monolithic workspace correctly before executing features.

## 3. Recommended Approach
**Direct Adjustment**. We will add "Epic 0: Project Foundation" to the backlog and include it in the sharded epics index. This maintains the project timeline while clearly defining the scaffolding tasks.

## 4. Detailed Change Proposals

### Edit 1: Update Epic Index
**File:** `bmad-output/planning-artifacts/epics-sharded/index.md`
```diff
  # 6:10 Assistant - Sharded Epics and Stories
  
  This index points to the per-epic story files generated from the approved epic breakdown.
  
+ - [Epic 0: Project Foundation](./epic-0-project-foundation.md)
  - [Epic 1: Morning Incident Review](./epic-1-morning-incident-review.md)
  - [Epic 2: Confidence Refinement Through Evidence Expansion](./epic-2-confidence-refinement-through-evidence-expansion.md)
```

### Edit 2: Create Epic 0
**File:** `bmad-output/planning-artifacts/epics-sharded/epic-0-project-foundation.md`
```markdown
## Epic 0: Project Foundation

Establish the core repository structure, development environment, and event-store database using the approved starter templates to enable feature development.

### Story E0.1: Set up frontend scaffolding
As a developer, I want to initialize the frontend using Vite and React, so that the team has a standard UI foundation.
**Acceptance Criteria:**
- Given the architecture decision, when scaffolding the UI, then the `6-10-assistant-ui` directory is created using `npm create vite@latest -- --template react-ts`.

### Story E0.2: Set up backend scaffolding
As a developer, I want to initialize the backend using Fastify and Emmett, so that the API and event store have a solid foundation.
**Acceptance Criteria:**
- Given the architecture decision, when scaffolding the backend, then the `6-10-assistant-api` directory is created using the Emmett PostgreSQL starter template.

### Story E0.3: Configure PostgreSQL Event Store
As a developer, I want to configure the local PostgreSQL database, so that the event store is ready to capture domain events.
**Acceptance Criteria:**
- Given the backend is scaffolded, when configuring the database, then a local PostgreSQL connection is established and the Emmett event store schema is applied via `.env.local`.

### Story E0.4: Test End-to-End Communication
As a developer, I want to test the connection between the frontend and backend, so that we can verify the stack is working before feature development begins.
**Acceptance Criteria:**
- Given both frontend and backend are running, when the frontend makes a request to a health-check endpoint on the backend, then it receives a successful response.
```

## 5. Implementation Handoff
- **Scope Classification:** Minor
- **Recipient:** Developer Agent
- **Responsibilities:** Apply the finalized edit proposals to the respective markdown files within the `epics-sharded` directory, establishing Epic 0 in the project planning artifacts.
