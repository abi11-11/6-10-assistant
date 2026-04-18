import React, { useState } from 'react';
import { Finding } from '../data/findings';

interface ReviewModalProps {
  finding: Finding;
  onClose: () => void;
  onSubmit: (action: 'APPROVED' | 'REJECTED' | 'REQUIRES_REFINEMENT', rationale: string) => void;
}

export function ReviewModal({ finding, onClose, onSubmit }: ReviewModalProps) {
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | 'REQUIRES_REFINEMENT' | null>(null);
  const [rationale, setRationale] = useState('');

  const decisionOptions = [
    { value: 'APPROVED', label: 'Approve', icon: 'verified', color: 'var(--tertiary)', desc: 'Include in briefing as reviewed finding' },
    { value: 'REJECTED', label: 'Reject', icon: 'block', color: 'var(--error)', desc: 'Exclude — flag as noise or false alarm' },
    { value: 'REQUIRES_REFINEMENT', label: 'Refine', icon: 'tune', color: 'var(--secondary)', desc: 'Include with modified conclusion' },
  ] as const;

  const handleSubmit = () => {
    if (!decision || !rationale.trim()) return;
    onSubmit(decision, rationale.trim());
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(13,17,23,0.8)',
          backdropFilter: 'blur(8px)', zIndex: 100,
        }}
      />

      {/* Modal */}
      <div className="layer-1 ambient-glow" style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 580, maxWidth: 'calc(100vw - 32px)', maxHeight: 'calc(100vh - 40px)',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.08)',
        zIndex: 101, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <style>{`
          @keyframes modalIn { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }
        `}</style>

        {/* Header */}
        <div className="layer-2" style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="layer-4" style={{
              padding: 10, borderRadius: 4,
              display: 'flex', alignItems: 'center',
            }}>
              <span className="material-symbols-outlined fill" style={{ color: 'var(--primary)', fontSize: 24 }}>gavel</span>
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em' }}>Final Determination</h2>
              <div className="font-machine" style={{ fontSize: 10, color: 'var(--on-surface-variant)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>ID: REQ-{finding.id.replace('finding-', 'X')}</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--outline)' }} />
                <span>CONFIDENCE: {Math.round(finding.confidence * 100)}%</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)', padding: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Evidence Summary */}
          <section>
            <div className="font-machine" style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>
              Findings Summary
            </div>
            <div className="layer-2" style={{ borderRadius: 4, padding: 20, borderLeft: '3px solid var(--primary)' }}>
              <p style={{ fontSize: 14, color: 'var(--on-surface)', lineHeight: 1.6, marginBottom: 12 }}>
                {finding.description}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {finding.evidence_ids.map(eid => (
                  <span key={eid} className="font-machine" style={{
                    fontSize: 10, padding: '4px 10px', borderRadius: 2,
                    background: 'rgba(0,0,0,0.2)', color: 'var(--on-surface-variant)',
                  }}>{eid}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Decision selector */}
          <section>
            <div className="font-machine" style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>
              Determination
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {decisionOptions.map(opt => {
                const isSelected = decision === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDecision(opt.value)}
                    className={isSelected ? 'layer-4' : 'layer-2'}
                    style={{
                      padding: '20px 16px', borderRadius: 4, cursor: 'pointer',
                      border: `1px solid ${isSelected ? opt.color : 'transparent'}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                      transition: 'all 0.15s',
                      boxShadow: isSelected ? `0 0 20px ${opt.color}15` : 'none',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: opt.color, fontSize: 28 }}>{opt.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>{opt.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', textAlign: 'center', lineHeight: 1.4 }}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Rationale */}
          <section>
            <div className="font-machine" style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>
              Rationale / Directives
            </div>
            <div style={{ position: 'relative' }}>
              <textarea
                rows={4}
                value={rationale}
                onChange={e => setRationale(e.target.value)}
                placeholder="PROPOSE JUSTIFICATION FOR DETERMINATION..."
                className="font-machine layer-2"
                style={{
                  width: '100%', border: '1px solid var(--outline)', borderRadius: 4,
                  color: 'var(--on-surface)', fontSize: 13,
                  padding: '16px', outline: 'none', resize: 'none',
                  lineHeight: 1.6,
                }}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="layer-2" style={{
          padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.03)',
          display: 'flex', justifyContent: 'flex-end', gap: 16, flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--on-surface-variant)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase'
          }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!decision || !rationale.trim()}
            style={{
              padding: '12px 32px', borderRadius: 4, border: 'none', 
              cursor: decision && rationale ? 'pointer' : 'not-allowed',
              background: decision === 'APPROVED' ? 'var(--tertiary)' : decision === 'REJECTED' ? 'var(--error)' : 'var(--primary)',
              color: 'var(--bg)', fontSize: 13, fontWeight: 900,
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: !decision || !rationale.trim() ? 0.4 : 1,
              transition: 'all 0.15s',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <span className="material-symbols-outlined sm">publish</span>
            Commit Decision
          </button>
        </div>
      </div>
    </>
  );
}
