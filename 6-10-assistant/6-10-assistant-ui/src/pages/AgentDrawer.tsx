import React, { useState, useEffect } from 'react';
import { Finding } from '../data/findings';

interface AgentStep {
  type: 'reasoning' | 'tool' | 'result' | 'loading';
  label: string;
  detail?: string;
  code?: string;
  time: string;
  delta?: number; // confidence shift
}

interface AgentDrawerProps {
  finding: Finding;
  onClose: () => void;
  onLaunchMission?: () => void;
}

export function AgentDrawer({ finding, onClose, onLaunchMission }: AgentDrawerProps) {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [done, setDone] = useState(false);
  const [proposal, setProposal] = useState<any>(null);

  // Fetch proposal and simulate agent running step by step
  useEffect(() => {
    const controller = new AbortController();
    const fetchAndSimulate = async () => {
      let currentProposal = null;
      try {
        const res = await fetch(`/findings/${finding.id}/proposal`, { signal: controller.signal });
        if (res.ok) {
          currentProposal = await res.json();
          setProposal(currentProposal);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Failed to fetch proposal', err);
        }
      }

      const sequence: AgentStep[] = [
        {
          type: 'reasoning', time: 'T-04:12',
          label: 'Reasoning Engine',
          detail: `Analyzing ${finding.unresolved_questions.length} unresolved questions for finding: "${finding.title}". Hypothesis confidence at ${Math.round(finding.confidence * 100)}%. Initiating evidence expansion.`,
        },
        {
          type: 'tool', time: 'T-04:08',
          label: 'Planning Logic',
          detail: currentProposal 
            ? `Generated mission proposal with ${currentProposal.checkpoints.length} checkpoints targeting ${finding.zone}.`
            : `Drafting telemetry expansion plan for ${finding.zone}...`,
          code: currentProposal ? JSON.stringify(currentProposal, null, 2) : undefined
        },
        {
          type: 'result', time: 'T-04:05',
          label: 'Plan Finalized',
          detail: currentProposal?.predicted_impact || 'Evidence acquisition path determined. Ready for simulation launch.',
        },
        {
          type: 'reasoning', time: 'T-03:59',
          label: 'Reasoning Engine',
          detail: `Mission plan optimized for maximum resolution of ${finding.unresolved_questions.length} vectors.`,
          delta: Math.round(finding.unresolved_questions.length * 8),
        },
      ];

      let i = 0;
      const timer = setInterval(() => {
        if (i < sequence.length) {
          setSteps(prev => [...prev, sequence[i]]);
          i++;
        } else {
          clearInterval(timer);
          setDone(true);
        }
      }, 900);
    };

    fetchAndSimulate();
    return () => {
      controller.abort();
    };
  }, [finding.id]);

  const beforeConf = Math.round(finding.confidence * 100);
  const afterConf = Math.min(99, beforeConf + 22);

  const typeColor: Record<AgentStep['type'], string> = {
    reasoning: 'var(--secondary)',
    tool: 'var(--primary)',
    result: 'var(--tertiary)',
    loading: 'var(--outline)',
  };
  const typeIcon: Record<AgentStep['type'], string> = {
    reasoning: 'psychology',
    tool: 'api',
    result: 'verified',
    loading: 'sync',
  };

  return (
    <>
      {/* Backdrop blur overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, background: 'rgba(13,17,23,0.6)',
          backdropFilter: 'blur(4px)', zIndex: 30,
        }}
      />

      {/* Drawer */}
      <aside className="layer-1 ambient-glow" style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 600,
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', zIndex: 40,
        animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>

        {/* Header */}
        <div className="glass" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.03)', flexShrink: 0,
        }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 900 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: 24 }}>psychology</span>
              Agentic Intelligence Feed
            </h2>
            <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="font-machine">SESSION_ID: {finding.id.replace('finding-', 'X')}-007</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--outline)' }} />
              <span style={{ color: done ? 'var(--tertiary)' : 'var(--primary)' }} className="font-machine">
                {done ? 'ANALYSIS_COMPLETE' : 'ACTIVE_REASONING'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="layer-4"
            style={{ border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', padding: 6, borderRadius: 4, display: 'flex' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Confidence Progress */}
        <div style={{ padding: '24px 24px 0' }}>
          <div className="layer-3" style={{ padding: '20px 24px', borderRadius: 4 }}>
            <div className="font-machine" style={{ fontSize: 10, color: 'var(--on-surface-variant)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Outcome Probability Update
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                <span className="font-machine" style={{ fontSize: 20, color: 'var(--outline)', textDecoration: 'line-through' }}>
                  {beforeConf}%
                </span>
                <span className="material-symbols-outlined" style={{ color: 'var(--outline)', marginBottom: 2 }}>arrow_forward</span>
                <span className="font-machine" style={{ fontSize: 32, fontWeight: 900, color: done ? 'var(--tertiary)' : 'var(--primary)' }}>
                  {done ? `${afterConf}%` : '...'}
                </span>
              </div>
              {done && (
                <div style={{
                  padding: '4px 10px', borderRadius: 2, background: 'rgba(63,185,80,0.1)',
                  color: 'var(--tertiary)', fontWeight: 800, fontSize: 12
                }} className="font-machine">
                  +{afterConf - beforeConf}% DELTA
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feed Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Thread line */}
            <div style={{
              position: 'absolute', left: 7, top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(to bottom, var(--surface-highest), transparent)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                  {/* Node */}
                  <div style={{
                    position: 'absolute', left: -24, top: 12,
                    width: 14, height: 14, borderRadius: 2,
                    background: step.type === 'loading' ? 'var(--bg)' : typeColor[step.type],
                    border: `3px solid var(--surface-dim)`,
                    zIndex: 1,
                  }} />

                  {/* Card */}
                  <div className="layer-3 ghost-border" style={{
                    flex: 1, padding: 20, borderRadius: 4,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {step.type === 'reasoning' && (
                      <div className="ai-gradient" style={{ position: 'absolute', inset: 0, opacity: 0.05 }} />
                    )}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: typeColor[step.type] }}>
                          <span className="material-symbols-outlined sm">{typeIcon[step.type]}</span>
                          <span className="font-machine" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>{step.label}</span>
                        </div>
                        <span className="font-machine" style={{ fontSize: 9, color: 'var(--outline)' }}>{step.time}</span>
                      </div>

                      {step.code && (
                        <div className="layer-0" style={{
                          padding: '14px 18px', borderRadius: 4,
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, whiteSpace: 'pre',
                          color: 'var(--primary)', lineHeight: 1.6, marginBottom: 12,
                          borderLeft: '2px solid var(--primary)'
                        }}>
                          {step.code}
                        </div>
                      )}

                      {step.detail && (
                        <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.7, margin: 0 }}>
                          {step.detail}
                        </p>
                      )}

                      {step.delta && (
                        <div className="layer-0" style={{
                          marginTop: 16, padding: '10px 14px', borderRadius: 4,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                          <span className="font-machine" style={{ fontSize: 10, color: 'var(--outline)', letterSpacing: '0.05em' }}>
                            CONFIDENCE_IMPACT
                          </span>
                          <span className="font-machine" style={{ fontSize: 11, fontWeight: 800, color: 'var(--tertiary)' }}>
                            +{step.delta}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {!done && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', opacity: 0.6 }}>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16, color: 'var(--primary)' }}>sync</span>
                  <span className="font-machine" style={{ fontSize: 11, color: 'var(--outline)' }}>
                    ACCESSING HISTORICAL TELEMETRY...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tactical Input Footer */}
        <div className="layer-2" style={{
          padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.03)',
          display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0,
        }}>
          {done && (
            <button 
              onClick={onLaunchMission}
              style={{
                padding: '12px 24px', borderRadius: 4, border: 'none', cursor: 'pointer',
                background: 'var(--tertiary)',
                color: 'var(--bg)', fontSize: 13, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: '0 4px 20px rgba(63,185,80,0.3)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                marginBottom: 8,
              }}
              className="animate-pulse"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              Launch Investigative Mission
            </button>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              placeholder="INJECT HUMAN DIRECTIVE..."
              className="font-machine"
              style={{
                flex: 1, background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--outline)', color: 'var(--on-surface)',
                fontSize: 12, borderRadius: 4, padding: '12px 16px', outline: 'none',
              }}
            />
            <button style={{
              padding: '0 24px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: 'var(--secondary)',
              color: 'var(--bg)', fontSize: 13, fontWeight: 800,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 12px rgba(188,140,255,0.3)',
              textTransform: 'uppercase'
            }}>
              <span className="material-symbols-outlined sm">send</span>
              Commit
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
