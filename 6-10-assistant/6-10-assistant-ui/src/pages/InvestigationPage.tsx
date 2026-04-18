import React, { useState } from 'react';
import { SEEDED_FINDINGS, SEVERITY_ICON_COLOR, Finding } from '../data/findings';
import { AgentDrawer } from './AgentDrawer';
import { ReviewModal } from './ReviewModal';
import { FacilityMap } from '../components/FacilityMap';

export function InvestigationPage({ onLaunchMission }: { onLaunchMission?: (f: Finding) => void }) {
  const [findings, setFindings] = useState<Finding[]>(SEEDED_FINDINGS || []);
  const [selectedId, setSelectedId] = useState<string | null>(
    (SEEDED_FINDINGS && SEEDED_FINDINGS.length > 0) ? SEEDED_FINDINGS[0].id : null
  );
  const [agentOpen, setAgentOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  React.useEffect(() => {
    const fetchFindings = async () => {
      try {
        const res = await fetch('/findings');
        if (res.ok) {
          const data = await res.json();
          setFindings(data);
          if (data.length > 0 && !selectedId) {
            setSelectedId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch findings:', err);
      }
    };
    fetchFindings();
  }, [selectedId]);

  const selected = (findings || []).find(f => f.id === selectedId);

  const handleDecision = async (action: 'APPROVED' | 'REJECTED' | 'REQUIRES_REFINEMENT', rationale: string) => {
    if (!selectedId) return;
    try {
      const res = await fetch(`/findings/${selectedId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rationale, reviewer: 'Maya' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setFindings(prev => prev.map(f => f.id === selectedId ? updated : f));
        setReviewOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }} className="layer-0">
      {/* LEFT PANEL — Findings Queue */}
      <aside className="layer-2" style={{
        width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column',
        zIndex: 10, height: '100%',
      }}>
        <div style={{
          padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(22,27,34,0.7)', backdropFilter: 'blur(8px)',
        }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--on-surface-variant)' }}>
            ACTIVE QUEUE
          </h2>
          <span className="font-machine" style={{ fontSize: 10, color: 'var(--outline)' }}>
            {findings.length} UNITS
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {findings?.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--outline)' }}>
              <div style={{ textAlign: 'center', fontSize: 12 }}>No findings</div>
            </div>
          ) : (
            (findings ?? []).map(f => {
              const isSelected = f.id === selectedId;
              const pct = Math.round((f.confidence ?? 0) * 100);
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedId(f.id)}
                  aria-selected={isSelected}
                  className={isSelected ? 'layer-3' : 'layer-1'}
                  style={{
                    position: 'relative', textAlign: 'left', padding: 12, borderRadius: 4,
                    border: isSelected ? '1px solid rgba(88,166,255,0.2)' : '1px solid transparent',
                    cursor: 'pointer', transition: 'all 0.15s',
                    boxShadow: isSelected ? '0 8px 16px rgba(0,0,0,0.2)' : 'none',
                    opacity: f.status === 'REJECTED' ? 0.6 : 1,
                  }}
                >
                  {/* Title row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="material-symbols-outlined sm" style={{ color: SEVERITY_ICON_COLOR[f.severity] }}>
                        {f.icon}
                      </span>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: isSelected ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                      }}>
                        {f.title}
                      </span>
                    </div>
                    <span className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', flexShrink: 0 }}>
                      {f.timestamp}
                    </span>
                  </div>

                  {/* Zone */}
                  <div className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', marginBottom: 12, textTransform: 'uppercase' }}>
                    {f.zone}
                  </div>

                  {/* Badges + confidence */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span className={`badge badge-${f.severity}`}>{f.severity}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="font-machine" style={{
                        fontSize: 10,
                        color: pct >= 70 ? 'var(--tertiary)' : pct >= 40 ? 'var(--amber)' : 'var(--error)',
                      }}>
                        {pct}%
                      </span>
                      <div style={{ width: 32, height: 2, background: 'var(--surface-highest)', borderRadius: 1, overflow: 'hidden' }}>
                        <div style={{
                          width: `${pct}%`, height: '100%',
                          background: pct >= 70 ? 'var(--tertiary)' : pct >= 40 ? 'var(--amber)' : 'var(--error)',
                        }} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* CENTER PANEL — Finding Detail */}
      <section style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', position: 'relative',
      }} className="layer-0">
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--outline)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 16, display: 'block', opacity: 0.5 }}>inbox</span>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No Finding Selected</div>
              <div style={{ fontSize: 12, marginTop: 8, opacity: 0.7 }}>Select a finding from the queue to view details</div>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
              width: 500, height: 500, borderRadius: '50%',
              background: 'rgba(88,166,255,0.03)', filter: 'blur(100px)', pointerEvents: 'none',
            }} />

            {selected.decision && (
              <div style={{ padding: '24px 32px 0' }}>
                <div className="layer-3 ghost-border" style={{
                  padding: '16px 20px', borderRadius: 4,
                  borderLeft: `4px solid ${
                    selected.decision.action === 'APPROVED' ? 'var(--tertiary)' 
                    : selected.decision.action === 'REJECTED' ? 'var(--error)' 
                    : 'var(--amber)'
                  }`,
                  background: 'rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="material-symbols-outlined sm" style={{ 
                        color: selected.decision.action === 'APPROVED' ? 'var(--tertiary)' : 'var(--error)' 
                      }}>
                        {selected.decision.action === 'APPROVED' ? 'verified' : 'gavel'}
                      </span>
                      <span className="font-machine" style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>
                        Human Review Verdict: {selected.decision.action}
                      </span>
                    </div>
                    <span className="font-machine" style={{ fontSize: 9, color: 'var(--outline)' }}>{selected.decision.at}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{selected.decision.rationale}"
                  </div>
                </div>
              </div>
            )}
            {/* Detail header */}
            <div style={{
              padding: '24px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className="font-machine" style={{ fontSize: 10, color: 'var(--outline)', letterSpacing: '0.08em' }}>
                    INCIDENT_ID: PR-{selected?.id.replace('finding-', '0') || '000'}342
                  </span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--outline)' }} />
                  <span className="font-machine" style={{
                    fontSize: 10, letterSpacing: '0.08em',
                    color: selected?.status === 'APPROVED' ? 'var(--tertiary)'
                      : selected?.status === 'REJECTED' ? 'var(--error)'
                      : 'var(--amber)',
                  }}>
                    STATUS: {selected?.status?.replace('_', ' ') || 'UNKNOWN'}
                  </span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.1 }}>
                  {selected?.title || 'No Incident Selected'}
                </h1>
                <div style={{ marginTop: 6, color: 'var(--on-surface-variant)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined sm">location_on</span>
                  {selected?.zone}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', marginBottom: 4, letterSpacing: '0.1em' }}>
                  CONFIDENCE_SCORE
                </div>
                <div className="font-machine" style={{
                  fontSize: 24, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.02em'
                }}>
                  {((selected?.confidence ?? 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Scrollable detail body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 32, position: 'relative', zIndex: 1 }}>

              {/* Decision badge (if decided) */}
              {selected.decision && (
                <div className="ambient-glow" style={{
                  padding: '16px 20px', borderRadius: 4,
                  background: selected.decision.action === 'APPROVED' ? 'rgba(63,185,80,0.08)' : 'rgba(248,81,73,0.08)',
                  borderLeft: `3px solid ${selected.decision.action === 'APPROVED' ? 'var(--tertiary)' : 'var(--error)'}`,
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <span className="material-symbols-outlined fill" style={{
                    color: selected.decision.action === 'APPROVED' ? 'var(--tertiary)' : 'var(--error)',
                    fontSize: 24,
                  }}>
                    {selected.decision.action === 'APPROVED' ? 'verified' : 'block'}
                  </span>
                  <div>
                    <div className="font-machine" style={{ fontSize: 11, fontWeight: 700, color: selected.decision.action === 'APPROVED' ? 'var(--tertiary)' : 'var(--error)', textTransform: 'uppercase' }}>
                      DECISION: {selected.decision.action} — {selected.decision.reviewer}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--on-surface)', marginTop: 4, lineHeight: 1.5 }}>
                      "{selected.decision.rationale}"
                    </div>
                    <div className="font-machine" style={{ fontSize: 10, color: 'var(--outline)', marginTop: 8 }}>
                      TIMESTAMP: {selected.decision.at}
                    </div>
                  </div>
                </div>
              )}

              {/* Observation Section */}
              <section>
                <div className="font-machine" style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>
                  [01] Observation
                </div>
                <div className="layer-1" style={{ padding: 20, borderRadius: 4 }}>
                  <p style={{ fontSize: 14, color: 'var(--on-surface)', lineHeight: 1.7 }}>
                    {selected.description}
                  </p>
                </div>
              </section>

              {/* AI Hypothesis Section */}
              <section>
                <div className="font-machine" style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>
                  [02] AI Analysis
                </div>
                <div style={{
                  position: 'relative', borderRadius: 4, padding: '20px 24px', overflow: 'hidden',
                  background: 'var(--surface-container)',
                }} className="ghost-border">
                  <div className="ai-gradient" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <span className="material-symbols-outlined sm" style={{ color: 'var(--secondary)' }}>auto_awesome</span>
                      <span className="font-machine" style={{ fontSize: 11, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase' }}>
                        Agentic Hypothesis
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--on-surface)', lineHeight: 1.7, fontWeight: 500 }}>
                      {selected.hypothesis}
                    </p>
                    <div style={{ marginTop: 24, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
                      <div className="font-machine" style={{ fontSize: 10, color: 'var(--secondary)', marginBottom: 6, letterSpacing: '0.06em' }}>
                        RECOMMENDED_ACTION
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>{selected.recommended_action}</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Evidence Grid */}
              <section>
                <div className="font-machine" style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>
                  [03] Correlated Evidence
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                  {selected.evidence_ids.map(eid => (
                    <div key={eid} className="layer-2 ghost-border" style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      borderRadius: 4, padding: '10px 12px', cursor: 'pointer',
                    }}>
                      <span className="material-symbols-outlined sm" style={{ color: 'var(--primary)', fontSize: 18 }}>
                        {eid.startsWith('CAM') ? 'videocam' : eid.startsWith('BADGE') ? 'badge' : eid.startsWith('SENS') ? 'sensors' : 'bolt'}
                      </span>
                      <span className="font-machine" style={{ fontSize: 10, fontWeight: 600 }}>{eid}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Uncertainty Section */}
              <section style={{ marginBottom: 40 }}>
                <div className="font-machine" style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>
                  [04] Honest Uncertainty
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selected.unresolved_questions.map((q, i) => (
                    <div key={i} className="layer-1" style={{
                      display: 'flex', gap: 14, padding: '14px 18px', borderRadius: 4,
                      borderLeft: '2px solid var(--amber)',
                    }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--amber)', fontSize: 18 }}>help</span>
                      <span style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>{q}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Action footer */}
            <div className="layer-2" style={{
              padding: '16px 32px',
              borderTop: '1px solid rgba(255,255,255,0.03)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0, zIndex: 20,
            }}>
              <button
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--on-surface-variant)', fontSize: 12, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
                onClick={() => {
                  setFindings(prev => prev.map(f => f.id === selectedId ? { ...f, status: 'REJECTED' } : f));
                }}
              >
                Dismiss
              </button>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setAgentOpen(true)}
                  className="layer-3 ghost-border"
                  style={{
                    padding: '10px 20px', color: 'var(--on-surface)',
                    fontSize: 13, fontWeight: 700, borderRadius: 4, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <span className="material-symbols-outlined sm">psychology</span>
                  Deep Analysis
                </button>
                <button
                  onClick={() => setReviewOpen(true)}
                  style={{
                    padding: '10px 24px',
                    background: selected.status === 'APPROVED' ? 'var(--tertiary)'
                      : selected.status === 'REJECTED' ? 'var(--error)'
                      : 'var(--primary)',
                    color: 'var(--on-primary)', fontSize: 13, fontWeight: 900,
                    borderRadius: 4, cursor: 'pointer', border: 'none',
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    textTransform: 'uppercase', letterSpacing: '0.02em'
                  }}
                >
                  <span className="material-symbols-outlined sm">gavel</span>
                  {selected.decision ? 'Update Decision' : 'Review Finding'}
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* RIGHT PANEL — Map + Timeline */}
      <aside className="layer-1" style={{
        width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column',
        borderLeft: '1px solid rgba(255,255,255,0.03)', zIndex: 10,
        height: '100%',
      }}>
        {/* Map Container */}
        <div style={{ height: '45%', borderBottom: '1px solid rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '12px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'linear-gradient(to bottom, var(--surface-dim) 0%, transparent 100%)',
          }}>
            <span className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SITE_MAP // {selected?.map_zone?.label || 'NULL'}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['+', '−'].map(btn => (
                <button key={btn} className="layer-3 ghost-border" style={{
                  width: 20, height: 20, borderRadius: 2,
                  color: 'var(--on-surface)', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{btn}</button>
              ))}
            </div>
          </div>
          {selected && <FacilityMap findings={findings} selectedId={selectedId} onSelect={setSelectedId} />}
        </div>

        {/* Timeline Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px', overflow: 'hidden' }}>
          <div className="font-machine" style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>
            Event Chain
          </div>
          <div style={{ flex: 1, overflowY: 'auto', position: 'relative', paddingLeft: 12 }}>
            {/* Timeline track */}
            <div style={{ position: 'absolute', top: 8, bottom: 8, left: 16, width: 1, background: 'var(--surface-highest)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {selected?.timeline_events?.map((evt, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                  {/* Marker */}
                  <div style={{ flexShrink: 0, marginTop: 4, position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: 1,
                      background: i === 0 ? 'var(--error)' : 'var(--outline)',
                      boxShadow: i === 0 ? '0 0 10px var(--error)' : 'none',
                    }} />
                    {i === 0 && (
                      <div style={{
                        position: 'absolute', inset: -4, borderRadius: 1,
                        background: 'var(--error)', opacity: 0.2,
                      }} className="animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div className="font-machine" style={{
                      fontSize: 9, color: i === 0 ? 'var(--error)' : 'var(--outline)', marginBottom: 4,
                    }}>
                      {evt.time} <span style={{ marginLeft: 8, opacity: 0.6 }}>[{evt.delta}]</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? 'var(--on-surface)' : 'var(--on-surface-variant)' }}>
                      {evt.label}
                    </div>
                    <div className="font-machine" style={{ fontSize: 11, color: 'var(--outline)', marginTop: 4, lineHeight: 1.4 }}>
                      {evt.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlays */}
      {agentOpen && <AgentDrawer finding={selected} onClose={() => setAgentOpen(false)} onLaunchMission={() => onLaunchMission?.(selected)} />}
      {reviewOpen && <ReviewModal finding={selected} onClose={() => setReviewOpen(false)} onSubmit={handleDecision} />}
    </div>
  );
}
