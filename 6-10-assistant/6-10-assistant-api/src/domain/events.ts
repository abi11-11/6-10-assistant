/**
 * Domain Events for 6:10 Assistant
 * Event-sourcing foundation for investigation workflow
 */

export interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: Date;
  data: unknown;
  version: number;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'READY_FOR_REVIEW' | 'APPROVED' | 'REJECTED';
  confidence: number; // 0-1
  unresolved_questions: string[];
  evidence_ids: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Evidence {
  id: string;
  finding_id: string;
  source: 'camera' | 'badge_reader' | 'fence_sensor' | 'drone_patrol' | 'mission_simulation';
  zone: string;
  observation: string;
  time_window: { start: Date; end: Date };
  confidence: number; // 0-1
  created_at: Date;
}

export interface Hypothesis {
  id: string;
  finding_id: string;
  explanation: string;
  supporting_evidence_ids: string[];
  contradicting_evidence_ids: string[];
  confidence: number; // 0-1
  created_at: Date;
}

export interface Mission {
  id: string;
  finding_id: string;
  route: { zone: string; action: string }[];
  target_uncertainty: string;
  predicted_evidence: { zone: string; type: string; expected_at: Date }[];
  status: 'PROPOSED' | 'APPROVED' | 'COMPLETED' | 'FAILED';
  created_at: Date;
  simulated_at?: Date;
}

export interface Decision {
  id: string;
  finding_id: string;
  decision_type: 'APPROVED' | 'REJECTED' | 'REQUIRES_REFINEMENT';
  reviewer_id: string;
  rationale: string;
  created_at: Date;
}

export interface Briefing {
  id: string;
  summary: string;
  findings: Finding[];
  key_decisions: Decision[];
  recommended_actions: string[];
  unresolved_uncertainties: string[];
  created_at: Date;
}

// Event types
export class IncidentReported implements DomainEvent {
  eventId = crypto.randomUUID();
  eventType = 'IncidentReported';
  aggregateType = 'Finding';
  version = 1;

  constructor(
    public aggregateId: string,
    public timestamp: Date,
    public data: {
      title: string;
      description: string;
      initial_evidence: string[];
    },
  ) {}
}

export class ConfidenceUpdated implements DomainEvent {
  eventId = crypto.randomUUID();
  eventType = 'ConfidenceUpdated';
  aggregateType = 'Finding';
  version = 1;

  constructor(
    public aggregateId: string,
    public timestamp: Date,
    public data: {
      new_confidence: number;
      reason: string;
      evidence_merged: string[];
    },
  ) {}
}

export class MissionProposed implements DomainEvent {
  eventId = crypto.randomUUID();
  eventType = 'MissionProposed';
  aggregateType = 'Finding';
  version = 1;

  constructor(
    public aggregateId: string,
    public timestamp: Date,
    public data: {
      mission_id: string;
      route: { zone: string; action: string }[];
      target_uncertainty: string;
    },
  ) {}
}

export class DecisionMade implements DomainEvent {
  eventId = crypto.randomUUID();
  eventType = 'DecisionMade';
  aggregateType = 'Finding';
  version = 1;

  constructor(
    public aggregateId: string,
    public timestamp: Date,
    public data: {
      decision_type: 'APPROVED' | 'REJECTED' | 'REQUIRES_REFINEMENT';
      reviewer_id: string;
      rationale: string;
    },
  ) {}
}
