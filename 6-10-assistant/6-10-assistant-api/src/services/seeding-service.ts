import { readFileSync } from 'fs';
import { join } from 'path';

export interface RawEvent {
  event_id: string;
  type: string;
  zone: string;
  timestamp: string;
  source: string;
  observation: string;
}

export interface OvernightScenario {
  scenario: string;
  timezone: string;
  incident_window: {
    start: string;
    end: string;
  };
  raw_events: RawEvent[];
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'READY_FOR_REVIEW' | 'APPROVED' | 'REJECTED';
  confidence: number;
  unresolved_questions: string[];
  evidence_ids: string[];
  created_at: Date;
  updated_at: Date;
}

/**
 * Load seeded overnight scenario fixture
 */
export function loadOvernightScenario(): OvernightScenario {
  const filePath = join(__dirname, '../../seeds/overnight-scenario.json');
  const fileContent = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent) as OvernightScenario;
}

/**
 * Transform raw events into prioritized findings with confidence scores
 */
export function transformEventsToFindings(events: RawEvent[]): Finding[] {
  const findings: Finding[] = [];
  const now = new Date();

  // Event-based finding templates with confidence scoring
  const eventHandlers: Record<string, (event: RawEvent) => Partial<Finding> | null> = {
    fence_breach: (event) => ({
      title: `Fence Alert Near ${event.zone}`,
      description: event.observation,
      confidence: 0.45,
      unresolved_questions: [
        'Was this wind, animal, or intentional?',
        'Did any other sensors trigger?',
        'Is there visual confirmation from cameras?',
      ],
      evidence_ids: [event.event_id],
    }),
    camera_malfunction: (event) => ({
      title: `Camera Activity in ${event.zone}`,
      description: event.observation,
      confidence: 0.35,
      unresolved_questions: [
        'Equipment malfunction or deliberate action?',
        'Is camera functional for investigation?',
      ],
      evidence_ids: [event.event_id],
    }),
    vehicle_detection: (event) => ({
      title: `Vehicle Detected Near ${event.zone}`,
      description: event.observation,
      confidence: 0.62,
      unresolved_questions: [
        'Authorized vehicle or unauthorized access?',
        'Route destination and duration?',
        'Any coordination with night shift?',
      ],
      evidence_ids: [event.event_id],
    }),
    badge_reader_anomaly: (event) => ({
      title: `Access Point Anomaly at ${event.zone}`,
      description: event.observation,
      confidence: 0.78,
      unresolved_questions: [
        'Who attempted access? Malfunction or break-in?',
        'What was the forced entry method?',
      ],
      evidence_ids: [event.event_id],
    }),
    power_spike: (event) => ({
      title: `Power Anomaly at ${event.zone}`,
      description: event.observation,
      confidence: 0.55,
      unresolved_questions: [
        'Normal operational variance or security concern?',
        'Correlation with other events?',
      ],
      evidence_ids: [event.event_id],
    }),
  };

  // Generate findings from each event
  events.forEach((event, index) => {
    const handler = eventHandlers[event.type];
    if (handler) {
      const findingData = handler(event);
      if (findingData) {
        findings.push({
          id: `finding-${index + 1}`,
          status: 'DRAFT',
          created_at: now,
          updated_at: now,
          ...findingData,
        } as Finding);
      }
    }
  });

  // Sort by confidence descending (prioritize)
  findings.sort((a, b) => b.confidence - a.confidence);

  return findings;
}

/**
 * Initialize findings from seeded scenario
 */
export function initializeSeededFindings(): Finding[] {
  const scenario = loadOvernightScenario();
  return transformEventsToFindings(scenario.raw_events);
}
