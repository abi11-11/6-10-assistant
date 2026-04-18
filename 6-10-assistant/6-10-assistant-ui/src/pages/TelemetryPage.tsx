import React, { useState } from 'react';
import { SEEDED_FINDINGS } from '../data/findings';

interface TelemetryEvent {
  id: string;
  timestamp: string;
  findingId: string;
  type: 'reasoning' | 'tool_invoke' | 'result' | 'evidence' | 'status_update';
  source: string;
  message: string;
  metadata?: any;
  severity: 'info' | 'warning' | 'success' | 'error';
}

export function TelemetryPage() {
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'reasoning' | 'tool_invoke' | 'result' | 'evidence'>('all');

  // Simulate telemetry events from the investigation workflow
  const generateEvents = (): TelemetryEvent[] => {
    const events: TelemetryEvent[] = [];
    let eventId = 1;

    SEEDED_FINDINGS.forEach(finding => {
      const baseTime = new Date('2026-04-18T06:10:00Z');
      
      events.push({
        id: `evt-${eventId++}`,
        timestamp: new Date(baseTime.getTime() + 1000).toISOString(),
        findingId: finding.id,
        type: 'reasoning',
        source: 'InvestigationAgent',
        message: `Analyzing finding: "${finding.title}" with ${finding.unresolved_questions.length} unresolved questions`,
        metadata: { confidence: finding.confidence, questions: finding.unresolved_questions.length },
        severity: 'info',
      });

      events.push({
        id: `evt-${eventId++}`,
        timestamp: new Date(baseTime.getTime() + 2000).toISOString(),
        findingId: finding.id,
        type: 'tool_invoke',
        source: 'MissionPlanner',
        message: `Invoking MCP-style tool: GenerateMissionProposal for zone ${finding.zone}`,
        metadata: { zone: finding.zone, tool: 'GenerateMissionProposal' },
        severity: 'info',
      });

      events.push({
        id: `evt-${eventId++}`,
        timestamp: new Date(baseTime.getTime() + 3000).toISOString(),
        findingId: finding.id,
        type: 'result',
        source: 'MissionPlanner',
        message: `Mission proposal generated with ${Math.floor(Math.random() * 3) + 3} checkpoints`,
        metadata: { checkpoints: Math.floor(Math.random() * 3) + 3 },
        severity: 'success',
      });

      events.push({
        id: `evt-${eventId++}`,
        timestamp: new Date(baseTime.getTime() + 4000).toISOString(),
        findingId: finding.id,
        type: 'evidence',
        source: 'EvidenceCollector',
        message: `Collected evidence from mission: ${Math.random() > 0.5 ? 'CONFIRMED' : 'UNRESOLVED'}`,
        metadata: { evidence_count: Math.floor(Math.random() * 5) + 1 },
        severity: finding.confidence > 0.6 ? 'success' : 'warning',
      });

      events.push({
        id: `evt-${eventId++}`,
        timestamp: new Date(baseTime.getTime() + 5000).toISOString(),
        findingId: finding.id,
        type: 'status_update',
        source: 'InvestigationAgent',
        message: `Finding ready for human review. Final confidence: ${Math.round(finding.confidence * 100)}%`,
        metadata: { final_confidence: finding.confidence, status: 'READY_FOR_REVIEW' },
        severity: 'success',
      });
    });

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const events = generateEvents();
  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);
  const displayed = selectedFinding ? filtered.filter(e => e.findingId === selectedFinding) : filtered;

  const typeIcons: Record<TelemetryEvent['type'], string> = {
    reasoning: 'psychology',
    tool_invoke: 'api',
    result: 'verified_user',
    evidence: 'collections_bookmark',
    status_update: 'update',
  };

  const typeColors: Record<TelemetryEvent['type'], string> = {
    reasoning: 'var(--secondary)',
    tool_invoke: 'var(--primary)',
    result: 'var(--tertiary)',
    evidence: 'var(--amber)',
    status_update: 'var(--tertiary)',
  };

  const severityColors: Record<TelemetryEvent['severity'], string> = {
    info: 'var(--primary)',
    warning: 'var(--amber)',
    success: 'var(--tertiary)',
    error: 'var(--error)',
  };

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }} className="layer-0">
      {/* LEFT: Finding selector */}
      <aside className="layer-2" style={{
        width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        height: '100%',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface)' }}>Findings</h3>
          <span className="font-machine" style={{ fontSize: 10, color: 'var(--outline)' }}>
            {SEEDED_FINDINGS.length}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button
            onClick={() => setSelectedFinding(null)}
            style={{
              width: '100%', padding: '10px 12px', textAlign: 'left', borderRadius: 4,
              border: !selectedFinding ? '1px solid var(--primary)' : '1px solid transparent',
              background: !selectedFinding ? 'rgba(88,166,255,0.1)' : 'transparent',
              color: 'var(--on-surface)', cursor: 'pointer', fontSize: 12,
              transition: 'all 0.2s',
            }}
          >
            All Findings
          </button>

          {SEEDED_FINDINGS.map(finding => (
            <button
              key={finding.id}
              onClick={() => setSelectedFinding(finding.id)}
              style={{
                width: '100%', padding: '10px 12px', textAlign: 'left', borderRadius: 4,
                border: selectedFinding === finding.id ? '1px solid var(--primary)' : '1px solid transparent',
                background: selectedFinding === finding.id ? 'rgba(88,166,255,0.1)' : 'transparent',
                color: selectedFinding === finding.id ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                cursor: 'pointer', fontSize: 12, transition: 'all 0.2s',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
              title={finding.title}
            >
              {finding.title}
            </button>
          ))}
        </div>
      </aside>

      {/* RIGHT: Event stream + filters */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Agent Telemetry Stream</h2>
            <div className="font-machine" style={{ fontSize: 11, color: 'var(--outline)' }}>
              Real-time investigation activity and MCP tool invocations
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', 'reasoning', 'tool_invoke', 'result', 'evidence'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 12px', borderRadius: 4,
                  border: filter === f ? '1px solid var(--primary)' : '1px solid var(--outline-variant)',
                  background: filter === f ? 'rgba(88,166,255,0.1)' : 'transparent',
                  color: filter === f ? 'var(--primary)' : 'var(--on-surface-variant)',
                  cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  textTransform: 'capitalize', transition: 'all 0.2s',
                }}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Event list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {displayed.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--outline)' }}>
              No events to display
            </div>
          ) : (
            displayed.map(event => (
              <div
                key={event.id}
                className="layer-1 ghost-border"
                style={{
                  padding: '16px', borderRadius: 4,
                  borderLeft: `3px solid ${typeColors[event.type]}`,
                  display: 'flex', gap: 12,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 4,
                  background: `${typeColors[event.type]}11`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20, color: typeColors[event.type] }}
                  >
                    {typeIcons[event.type]}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>
                        {event.source}
                      </div>
                      <div className="font-machine" style={{ fontSize: 10, color: 'var(--outline)', marginTop: 2 }}>
                        {event.type.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 16,
                          color: severityColors[event.severity],
                        }}
                      >
                        {event.severity === 'success' ? 'check_circle' : event.severity === 'warning' ? 'warning' : event.severity === 'error' ? 'error' : 'info'}
                      </span>
                      <span className="font-machine" style={{ fontSize: 11, color: 'var(--outline)', minWidth: 80, textAlign: 'right' }}>
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--on-surface)', lineHeight: 1.5, marginBottom: 8 }}>
                    {event.message}
                  </div>

                  {event.metadata && (
                    <div className="layer-2" style={{
                      padding: '8px 12px', borderRadius: 3, fontSize: 11,
                      fontFamily: 'monospace', color: 'var(--on-surface-variant)',
                      background: 'rgba(0,0,0,0.2)', overflow: 'auto', maxHeight: 100,
                    }}>
                      {JSON.stringify(event.metadata, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
