// Seeded data matching the backend overnight scenario

export interface Finding {
  id: string;
  title: string;
  zone: string;
  description: string;
  status: 'DRAFT' | 'UNDER_INVESTIGATION' | 'READY_FOR_REVIEW' | 'APPROVED' | 'REJECTED';
  confidence: number;
  icon: string;
  severity: 'critical' | 'warning' | 'log';
  unresolved_questions: string[];
  evidence_ids: string[];
  hypothesis: string;
  recommended_action: string;
  timestamp: string;
  timeline_events: { time: string; label: string; detail: string; delta: string }[];
  map_zone: { x: number; y: number; label: string };
  decision?: { action: 'APPROVED' | 'REJECTED' | 'REQUIRES_REFINEMENT'; rationale: string; reviewer: string; at: string };
}

export const SEEDED_FINDINGS: Finding[] = [
  {
    id: 'finding-1',
    title: 'Access Point Anomaly',
    zone: 'ADMIN BUILDING',
    description: 'Three failed badge swipes detected at access point AP-04 between 03:10–03:18. Door forced open at 03:15. No authorized personnel scheduled for this zone.',
    status: 'DRAFT',
    confidence: 0.78,
    icon: 'badge',
    severity: 'critical',
    unresolved_questions: [
      'Who attempted access? Malfunction or break-in?',
      'What was the forced entry method?',
    ],
    evidence_ids: ['BADGE-007', 'BADGE-008', 'CAM-012'],
    hypothesis: 'Badge reader anomaly at AP-04 is consistent with unauthorized access attempt. Three sequential failed swipes followed by forced entry suggests a deliberate intrusion rather than equipment malfunction.',
    recommended_action: 'Run badge access query for admin-building 02:00–04:00 window and cross-reference with personnel schedules.',
    timestamp: '06:02Z',
    timeline_events: [
      { time: '03:10Z', label: 'First Failed Swipe', detail: 'Badge reader AP-04', delta: 'T-2h 52m' },
      { time: '03:14Z', label: 'Repeated Failure (×3)', detail: 'Sequential failed attempts', delta: 'T-2h 48m' },
      { time: '03:15Z', label: 'Forced Entry Detected', detail: 'Door sensor triggered', delta: 'T-2h 47m' },
      { time: '03:18Z', label: 'Area Clear — No Occupant Found', detail: 'Night supervisor check', delta: 'T-2h 44m' },
    ],
    map_zone: { x: 55, y: 35, label: 'ADMIN-BLDG' },
  },
  {
    id: 'finding-2',
    title: 'Vehicle Detected Near Restricted Yard',
    zone: 'STORAGE // YARD-B',
    description: 'Unregistered vehicle detected on camera CAM-07 traversing restricted access road adjacent to storage-yard-south at 05:42. Vehicle did not stop at checkpoint.',
    status: 'DRAFT',
    confidence: 0.62,
    icon: 'directions_car',
    severity: 'warning',
    unresolved_questions: [
      'Authorized vehicle or unauthorized access?',
      'Route destination and duration?',
      'Any coordination with night shift?',
    ],
    evidence_ids: ['CAM-007', 'MOTION-003'],
    hypothesis: 'Vehicle path suggests deliberate avoidance of checkpoint. Route trajectory leads toward the restricted chemical storage yard. Night shift logs show no expected deliveries.',
    recommended_action: 'Cross-reference vehicle plates against authorized vendor list and check night shift delivery manifest.',
    timestamp: '05:45Z',
    timeline_events: [
      { time: '05:41Z', label: 'Vehicle First Spotted', detail: 'Perimeter camera CAM-03', delta: 'T-29m' },
      { time: '05:42Z', label: 'Checkpoint Bypass', detail: 'No stop at gate', delta: 'T-28m' },
      { time: '05:44Z', label: 'Vehicle Leaves Zone', detail: 'Exits via south road', delta: 'T-26m' },
    ],
    map_zone: { x: 72, y: 68, label: 'YARD-B' },
  },
  {
    id: 'finding-3',
    title: 'Power Anomaly at Data Center',
    zone: 'DATA CENTER // DC-01',
    description: 'Unexplained power spike of +14.2% recorded at data center UPS panel at 04:55. Spike lasted 38 seconds. No maintenance was scheduled.',
    status: 'DRAFT',
    confidence: 0.55,
    icon: 'bolt',
    severity: 'warning',
    unresolved_questions: [
      'Normal operational variance or security concern?',
      'Correlation with other events in this window?',
    ],
    evidence_ids: ['POWER-002', 'SENS-AC-09'],
    hypothesis: 'Power spike may be consistent with unauthorized equipment connection or HVAC anomaly. Duration and magnitude are outside normal operational variance.',
    recommended_action: 'Inspect UPS panel DC-01 and check equipment inventory against last baseline audit.',
    timestamp: '04:55Z',
    timeline_events: [
      { time: '04:53Z', label: 'Baseline Stable', detail: 'UPS normal range', delta: 'T-1h 17m' },
      { time: '04:55Z', label: 'Spike Detected +14.2%', detail: 'UPS panel DC-01', delta: 'T-1h 15m' },
      { time: '04:55:38Z', label: 'Return to Normal', detail: 'Auto-stabilized', delta: 'T-1h 14m' },
    ],
    map_zone: { x: 38, y: 55, label: 'DC-01' },
  },
  {
    id: 'finding-4',
    title: 'Fence Alert Near Gate 3',
    zone: 'PERIMETER // GATE-03',
    description: 'Acoustic sensor grid detected metallic friction signature near Gate 3 perimeter section P-12 at 06:02. Tension sensors show minor fluctuation. Duration ~8 seconds.',
    status: 'DRAFT',
    confidence: 0.45,
    icon: 'fence',
    severity: 'warning',
    unresolved_questions: [
      'Was this wind, animal, or intentional?',
      'Did any other sensors trigger simultaneously?',
      'Is there visual confirmation from cameras?',
    ],
    evidence_ids: ['SENS-AC-04', 'FENCE-P12'],
    hypothesis: 'Acoustic signature near Gate 3 indicates metallic friction consistent with climbing or cutting tools. Probability of false alarm (wildlife) is low due to localized nature of disturbance.',
    recommended_action: 'Deploy drone for visual confirmation of Gate 3 perimeter area.',
    timestamp: '06:02Z',
    timeline_events: [
      { time: '06:01:45Z', label: 'Acoustic Anomaly', detail: 'Sector West microphones', delta: 'T-29s' },
      { time: '06:02:14Z', label: 'Fence Alert Triggered', detail: 'AI confidence >85%', delta: 'T-0' },
    ],
    map_zone: { x: 90, y: 60, label: 'GATE-03' },
  },
  {
    id: 'finding-5',
    title: 'Camera Activity in Block C',
    zone: 'SURVEILLANCE // BLOCK-C',
    description: 'Camera CAM-11 in Block C experienced 4-minute offline period at 04:12. Camera came back online without manual intervention. Night supervisor Raghav noted this in handoff log.',
    status: 'DRAFT',
    confidence: 0.35,
    icon: 'videocam_off',
    severity: 'log',
    unresolved_questions: [
      'Equipment malfunction or deliberate action?',
      'Is camera footage intact for the gap period?',
    ],
    evidence_ids: ['CAM-011', 'LOG-RAGHAV-04'],
    hypothesis: 'Camera dropout may be coincidental malfunction. However, timing correlation with other overnight events warrants logging. No direct threat indicators.',
    recommended_action: 'Review CAM-11 footage gap. Check maintenance logs for Block C camera known issues.',
    timestamp: '04:12Z',
    timeline_events: [
      { time: '04:12Z', label: 'CAM-11 Goes Offline', detail: 'Block C — unplanned', delta: 'T-1h 58m' },
      { time: '04:16Z', label: 'CAM-11 Restored', detail: 'Auto-recovery', delta: 'T-1h 54m' },
      { time: '04:17Z', label: 'Raghav Notes in Log', detail: 'Night supervisor handoff', delta: 'T-1h 53m' },
    ],
    map_zone: { x: 25, y: 30, label: 'BLOCK-C' },
  },
];

export const STATUS_BADGE_CLASS: Record<Finding['status'], string> = {
  DRAFT:                'badge-draft',
  UNDER_INVESTIGATION:  'badge-investigating',
  READY_FOR_REVIEW:     'badge-review',
  APPROVED:             'badge-approved',
  REJECTED:             'badge-rejected',
};

export const SEVERITY_ICON_COLOR: Record<Finding['severity'], string> = {
  critical: 'var(--error)',
  warning:  'var(--amber)',
  log:      'var(--outline)',
};
