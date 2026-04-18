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
