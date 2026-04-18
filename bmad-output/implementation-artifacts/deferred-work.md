## Deferred from: code review of e0-1-set-up-frontend-scaffolding.md (2026-04-18)

- Hardcoded proxy target [vite.config.ts] - deferred, standard scaffolding output

## Deferred from: code review of 2-1-detect-unresolved-questions-and-plan-evidence-expansion.md (2026-04-18)

- [Review][Defer] Linear Confidence Delta calculation is simplistic: The formula `Math.round(finding.unresolved_questions.length * 8)` is a linear placeholder. It should eventually be replaced by a more sophisticated model that weights uncertainty types.

## Deferred from: code review of 2-2-invoke-mcp-style-investigation-tool-through-stable-adapter.md (2026-04-18)
- [Review][Defer] Simulation timing is arbitrary: The 1500ms/2000ms delays are hardcoded for visual effect. They should eventually be driven by actual mission distance or real-time sensor polling.

## Deferred from: code review of 2-3-merge-new-evidence-and-recompute-finding-confidence.md (2026-04-18)
- [Review][Defer] Persistence is in-memory only: All finding updates (confidence, description) are lost when the server restarts. A PostgreSQL persistence layer should be added in Epic 5.

## Deferred from: code review of 3-4-adaptive-sensor-overlays.md (2026-04-18)
- [Review][Defer] Decouple sensor logic: The sensor mode is currently hardcoded based on checkpoint label prefixes. This should be moved to a sensor_mode field in the MissionCheckpoint model on the backend.
