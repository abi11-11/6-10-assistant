import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadOvernightScenario,
  transformEventsToFindings,
  type OvernightScenario,
  type RawEvent,
} from './seeding-service';

describe('SeedingService - Story 1.1 AC Tests', () => {
  let scenario: OvernightScenario;

  beforeEach(async () => {
    scenario = await loadOvernightScenario();
  });

  describe('AC1: Load seeded overnight scenario fixture', () => {
    it('should load overnight scenario with valid structure', async () => {
      expect(scenario).toBeDefined();
      expect(scenario.scenario).toBe('overnight-incidents-2024-03-15');
      expect(scenario.timezone).toBe('UTC');
      expect(scenario.incident_window).toBeDefined();
      expect(scenario.raw_events).toBeDefined();
    });

    it('should load exactly 5 raw events from fixture', async () => {
      expect(Array.isArray(scenario.raw_events)).toBe(true);
      expect(scenario.raw_events).toHaveLength(5);
    });

    it('each raw event should have required properties', async () => {
      scenario.raw_events.forEach((event: RawEvent) => {
        expect(event.event_id).toBeDefined();
        expect(event.type).toBeDefined();
        expect(event.zone).toBeDefined();
        expect(event.timestamp).toBeDefined();
        expect(event.source).toBeDefined();
        expect(event.observation).toBeDefined();
      });
    });
  });

  describe('AC2: Transform seeded events into prioritized findings', () => {
    it('should transform raw events into findings', () => {
      const findings = transformEventsToFindings(scenario.raw_events);

      expect(Array.isArray(findings)).toBe(true);
      expect(findings.length).toBeLessThanOrEqual(5);
      expect(findings.length).toBeGreaterThan(0);
    });

    it('each finding should have required properties', () => {
      const findings = transformEventsToFindings(scenario.raw_events);

      findings.forEach((finding) => {
        expect(finding.id).toBeDefined();
        expect(typeof finding.id).toBe('string');

        expect(finding.title).toBeDefined();
        expect(typeof finding.title).toBe('string');

        expect(finding.status).toBeDefined();
        expect(['DRAFT', 'UNDER_INVESTIGATION', 'RESOLVED']).toContain(finding.status);

        expect(typeof finding.confidence).toBe('number');
        expect(finding.confidence).toBeGreaterThanOrEqual(0);
        expect(finding.confidence).toBeLessThanOrEqual(1);

        expect(Array.isArray(finding.evidence_ids)).toBe(true);
        expect(Array.isArray(finding.unresolved_questions)).toBe(true);
      });
    });

    it('findings should have confidence values', () => {
      const findings = transformEventsToFindings(scenario.raw_events);

      findings.forEach((finding) => {
        expect(finding.confidence).toBeGreaterThan(0.3);
        expect(finding.confidence).toBeLessThan(1);
      });
    });

    it('findings should have descriptive titles', () => {
      const findings = transformEventsToFindings(scenario.raw_events);

      findings.forEach((finding) => {
        expect(finding.title.length).toBeGreaterThan(5);
      });
    });

    it('should link events to evidence_ids', () => {
      const findings = transformEventsToFindings(scenario.raw_events);

      findings.forEach((finding) => {
        expect(finding.evidence_ids.length).toBeGreaterThan(0);
        expect(Array.isArray(finding.evidence_ids)).toBe(true);
      });
    });

    it('should include unresolved questions for each finding', () => {
      const findings = transformEventsToFindings(scenario.raw_events);

      findings.forEach((finding) => {
        expect(Array.isArray(finding.unresolved_questions)).toBe(true);
        // At least some findings should have questions
        if (finding.confidence < 0.8) {
          expect(finding.unresolved_questions.length).toBeGreaterThan(0);
        }
      });
    });

    it('findings should be prioritized by confidence (descending)', () => {
      const findings = transformEventsToFindings(scenario.raw_events);

      for (let i = 1; i < findings.length; i++) {
        expect(findings[i - 1].confidence).toBeGreaterThanOrEqual(findings[i].confidence);
      }
    });
  });
});
