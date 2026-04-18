import React, { useState } from 'react';
import { Finding } from '../data/findings';

interface BriefingPageProps {
  findings: Finding[];
}

export function BriefingPage({ findings }: BriefingPageProps) {
  const [published, setPublished] = useState(false);
  const approved = findings.filter(f => f.status === 'APPROVED');
  const refined = findings.filter(f => f.status === 'REQUIRES_REFINEMENT');
  const highlights = [...approved, ...refined];
  const rejected = findings.filter(f => f.status === 'REJECTED');
  const pending = findings.filter(f => !['APPROVED', 'REJECTED', 'REQUIRES_REFINEMENT'].includes(f.status));

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '48px 40px', maxWidth: 1000, margin: '0 auto', width: '100%' }} className="layer-0">
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div className="font-machine" style={{ fontSize: 10, color: 'var(--outline)', marginBottom: 8, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Operations Executive Briefing
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              Ridgeway Site · Overnight Intelligence
            </h1>
            <div style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>April 17, 2026</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--outline)' }} />
              <span>Lead Analyst: <strong style={{ color: 'var(--on-surface)' }}>Maya</strong></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {!published ? (
              <button
                onClick={() => setPublished(true)}
                style={{
                  padding: '12px 24px', borderRadius: 4, border: 'none',
                  background: 'var(--primary)', color: 'var(--bg)',
                  fontSize: 13, fontWeight: 900, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 4px 16px rgba(88,166,255,0.2)',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                <span className="material-symbols-outlined sm">send</span>
                Publish Briefing
              </button>
            ) : (
              <div className="layer-3 ghost-border" style={{ padding: '10px 20px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--tertiary)' }}>
                <span className="material-symbols-outlined sm fill">verified</span>
                <span className="font-machine" style={{ fontSize: 12, fontWeight: 800 }}>STATUS: PUBLISHED</span>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'REVIEW_TOTAL', value: approved.length + rejected.length + refined.length, color: 'var(--primary)' },
            { label: 'APPROVED/REFINED', value: approved.length + refined.length, color: 'var(--tertiary)' },
            { label: 'DISMISSED', value: rejected.length, color: 'var(--outline)' },
            { label: 'UNCERTAIN', value: pending.length, color: 'var(--amber)' },
          ].map(stat => (
            <div key={stat.label} className="layer-1 ghost-border" style={{ padding: '16px 20px', borderRadius: 4 }}>
              <div className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', marginBottom: 8, letterSpacing: '0.08em' }}>{stat.label}</div>
              <div className="font-machine" style={{ fontSize: 24, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Analysis Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        
        {/* Approved High-Priority Findings */}
        <section>
          <div className="font-machine" style={{ fontSize: 11, fontWeight: 800, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 24, textTransform: 'uppercase' }}>
            [01] Intelligence Highlights
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {highlights.length > 0 ? highlights.map(f => (
              <div key={f.id} className="layer-1 ghost-border" style={{ padding: 24, borderRadius: 4, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 2, background: f.status === 'APPROVED' ? 'rgba(63,185,80,0.1)' : 'rgba(255,191,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined sm" style={{ color: f.status === 'APPROVED' ? 'var(--tertiary)' : 'var(--amber)' }}>
                        {f.status === 'APPROVED' ? 'verified' : 'edit_note'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800 }}>{f.title}</h3>
                  </div>
                  <div className="font-machine" style={{ 
                    fontSize: 10, 
                    color: f.status === 'APPROVED' ? 'var(--tertiary)' : 'var(--amber)', 
                    border: `1px solid ${f.status === 'APPROVED' ? 'var(--tertiary)' : 'var(--amber)'}`, 
                    padding: '3px 8px', borderRadius: 2 
                  }}>
                    {f.status}
                  </div>
                </div>
                <p style={{ fontSize: 15, color: 'var(--on-surface)', lineHeight: 1.7, marginBottom: 20 }}>
                  {f.hypothesis}
                </p>
                <div className="layer-2" style={{ padding: 16, borderRadius: 4, display: 'flex', gap: 24 }}>
                  <div>
                    <div className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', marginBottom: 4 }}>LOCATION</div>
                    <div className="font-machine" style={{ fontSize: 12, fontWeight: 700 }}>{f.zone}</div>
                  </div>
                  <div>
                    <div className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', marginBottom: 4 }}>CONFIDENCE</div>
                    <div className="font-machine" style={{ fontSize: 12, fontWeight: 700, color: 'var(--tertiary)' }}>{Math.round(f.confidence * 100)}%</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', marginBottom: 4 }}>REVIEWER_NOTE</div>
                    <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
                      {f.decision?.rationale || 'No rationale provided.'}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="layer-1 ghost-border" style={{ padding: 32, borderRadius: 4, textAlign: 'center', color: 'var(--outline)' }}>
                NO REVIEWED HIGHLIGHTS FOR THIS PERIOD
              </div>
            )}
          </div>
        </section>

        {/* Strategic Recommendations */}
        <section>
          <div className="font-machine" style={{ fontSize: 11, fontWeight: 800, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 24, textTransform: 'uppercase' }}>
            [02] Strategic Recommendations
          </div>
          <div className="layer-2 ghost-border" style={{ borderRadius: 4, overflow: 'hidden' }}>
            {highlights.map((f, i) => (
              <div key={f.id} style={{ 
                padding: '24px 32px', 
                borderBottom: i === highlights.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)',
                display: 'flex', gap: 24, alignItems: 'center'
              }}>
                <div className="font-machine" style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary)', opacity: 0.5 }}>0{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', lineHeight: 1.5 }}>
                    {f.recommended_action}
                  </div>
                  <div className="font-machine" style={{ fontSize: 10, color: 'var(--outline)', marginTop: 4 }}>
                    DERIVED_FROM: {f.title.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
            {highlights.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--outline)', fontSize: 13 }}>
                NO STRATEGIC RECOMMENDATIONS AVAILABLE
              </div>
            )}
          </div>
        </section>

        {/* Unresolved Risks */}
        {pending.length > 0 && (
          <section>
            <div className="font-machine" style={{ fontSize: 11, fontWeight: 800, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 24, textTransform: 'uppercase' }}>
              [03] Unresolved Operational Risks
            </div>
            <div className="layer-1" style={{ padding: '24px 32px', borderRadius: 4, borderLeft: '4px solid var(--amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--amber)' }}>report_problem</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--amber)' }}>HONEST UNCERTAINTY ADVISORY</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {pending.map(f => (
                  <div key={f.id}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                      Resolution inhibited by: {f.unresolved_questions[0]}
                    </div>
                    <div className="font-machine" style={{ fontSize: 10, color: 'var(--outline)', marginTop: 6 }}>
                      CURRENT_CONFIDENCE: {Math.round(f.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer Footer */}
      <footer style={{ marginTop: 64, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <button className="layer-4" style={{ background: 'none', border: 'none', color: 'var(--outline)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined sm">download</span> PDF EXPORT
          </button>
          <button className="layer-4" style={{ background: 'none', border: 'none', color: 'var(--outline)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined sm">share</span> SITE LOGS
          </button>
        </div>
        <div className="font-machine" style={{ fontSize: 10, color: 'var(--outline)' }}>
          SECURE ENCRYPTED TRANSMISSION · VER 6.10.Alpha
        </div>
      </footer>
    </div>
  );
}
