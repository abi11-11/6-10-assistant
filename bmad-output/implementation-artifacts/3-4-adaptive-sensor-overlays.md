# Story 3.4: Adaptive Sensor Overlays (Thermal/Visual)

Status: review

## Story

As an operator,
I want to see simulated sensor data overlays (Thermal scan active, Visual anomaly detected) during the mission simulation,
so that the simulation feels authentic to the drone's capabilities.

## Acceptance Criteria

1. **Given** a checkpoint is active, **when** it is a "PERIMETER_SCAN", **then** show a "THERMAL_OVERLAY: ACTIVE" indicator in the HUD.
2. **Given** a checkpoint is active, **when** it is a "TARGET_RECON", **then** show a "FACIAL_RECOG: SCANNING..." indicator.
3. The drone marker on the map should change color or style based on the active sensor mode.

## Tasks / Subtasks

- [x] Update `MissionPage.tsx` to include a `sensorMode` state driven by the current checkpoint's label.
- [x] Add visual overlays/indicators in the Map area for Thermal and Recon modes.
- [x] Update the drone marker style in `MissionPage.tsx` to reflect the active sensor mode.

### Review Findings

- [ ] [Review][Patch] Define 'pulse' animation: The `pulse` animation is referenced in `MissionPage.tsx` but not defined in CSS.
- [ ] [Review][Patch] Fix typo in HUD stats: `EST_CONF_I"` should be `EST_CONF_Δ`.
- [ ] [Review][Patch] Minor HUD Polish: Add a subtle jitter or noise to 'BATTERY' and 'ALTITUDE' to make them feel live.
- [x] [Review][Defer] Hardcoded sensor logic — deferred, acceptable for prototype.
