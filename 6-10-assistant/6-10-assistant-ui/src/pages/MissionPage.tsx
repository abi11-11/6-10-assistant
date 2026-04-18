import React, { useState } from 'react';
import { Finding } from '../data/findings';

interface MissionPageProps {
  finding: Finding;
  onBack: () => void;
}

type SimState = 'idle' | 'running' | 'done';

const CHECKPOINTS = [
  { id: 1, label: 'LAUNCH', x: '18%', y: '72%', purpose: 'DEPLOYMENT POINT', resolves: 'N/A — START' },
  { id: 2, label: 'WAYPT_ALPHA', x: '42%', y: '48%', purpose: 'PERIMETER SCAN', resolves: 'BREACH VERIFICATION' },
  { id: 3, label: 'SCAN_SECTOR', x: '67%', y: '64%', purpose: 'CAM CROSS-CHECK', resolves: 'UNAUTHORIZED ENTRY' },
  { id: 4, label: 'TARGET_OBJ', x: '87%', y: '30%', purpose: 'FINAL OBS', resolves: 'THREAT PERSISTENCE' },
];

const SIM_OUTCOMES = [
  { checkpoint: 'LAUNCH', status: 'ok', text: 'TAKEOFF SUCCESSFUL — TELEMETRY NOMINAL' },
  { checkpoint: 'WAYPT_ALPHA', status: 'ok', text: 'NO PHYSICAL BREACH FOUND. MINOR TENSION MARK DETECTED.' },
  { checkpoint: 'SCAN_SECTOR', status: 'warn', text: 'MOTION DETECTED — LIKELY WINDBLOWN DEBRIS.' },
  { checkpoint: 'TARGET_OBJ', status: 'ok', text: 'AREA CLEAR. NO UNAUTHORIZED PERSONNEL DETECTED.' },
];

export function MissionPage({ finding, onBack, onFinalize }: MissionPageProps) {
  const [sim, setSim] = useState<SimState>('idle');
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [proposal, setProposal] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [sensorMode, setSensorMode] = useState<'IDLE' | 'THERMAL' | 'RECON' | 'DATA'>('IDLE');
  const intervalRef = React.useRef<any>(null);

  // Derive sensor mode from current checkpoint
  const updateSensorMode = (cp: any) => {
    if (!cp) return setSensorMode('IDLE');
    if (cp.label.includes('PERIMETER')) return setSensorMode('THERMAL');
    if (cp.label.includes('TARGET') || cp.label.includes('RECON')) return setSensorMode('RECON');
    if (cp.label.includes('DATA') || cp.label.includes('UPLOAD')) return setSensorMode('DATA');
    setSensorMode('IDLE');
  };

  // ... useEffect cleanup ...

  const startSim = async () => {
    setError(null);
    setSim('running');
    setCompletedSteps(0);
    setSensorMode('IDLE');
    
    try {
      const res = await fetch(`/findings/${finding.id}/mission/execute`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProposal(data.proposal);
        setResults(data.result);

        // Run the visual simulation based on actual checkpoints
        const checkpointCount = data.proposal.checkpoints.length;
        let step = 0;
        intervalRef.current = setInterval(() => {
          step++;
          setCompletedSteps(step);
          
          const currentCP = data.proposal.checkpoints[step - 1];
          updateSensorMode(currentCP);

          if (step >= checkpointCount) {
            clearInterval(intervalRef.current);
            setSim('done');
            setSensorMode('IDLE');
          }
        }, 1500);
      } else {
        setSim('idle');
        setError('Mission Execution Failed: Backend unreachable or finding invalid.');
      }
    } catch (err) {
      console.error(err);
      setSim('idle');
      setError('Connection Error: Mission launch aborted.');
    }
  };

  const finalizeMission = async () => {
    if (!results) return;
    setIsFinalizing(true);
    try {
      const res = await fetch(`/findings/${finding.id}/mission/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: results }),
      });
      if (res.ok) {
        onFinalize?.();
      } else {
        alert('Failed to finalize mission.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }} className="layer-0">
      {/* LEFT — Map */}
      <section style={{ flex: 1, position: 'relative', overflow: 'hidden' }} className="layer-1">
        {/* Tactical Grid Background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(88,166,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88,166,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Route SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--primary)" opacity="0.6" />
            </marker>
          </defs>
          <polyline
            points={(proposal?.checkpoints || []).map((c: any) =>
              `${c.location.x}%,${c.location.y}%`
            ).join(' ')}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeDasharray="10,8"
            opacity="0.4"
            markerEnd="url(#arrow)"
            style={{ vectorEffect: 'non-scaling-stroke' }}
          />
          {sim === 'running' && completedSteps > 0 && proposal?.checkpoints[completedSteps - 1] && (
            <circle
              cx={`${proposal.checkpoints[completedSteps - 1].location.x}%`}
              cy={`${proposal.checkpoints[completedSteps - 1].location.y}%`}
              r="12"
              fill={sensorMode === 'THERMAL' ? 'var(--error)' : sensorMode === 'RECON' ? 'var(--secondary)' : 'var(--cyan)'}
              className="animate-pulse"
              style={{ filter: `drop-shadow(0 0 12px ${sensorMode === 'THERMAL' ? 'var(--error)' : 'var(--cyan)'})`, transition: 'all 0.5s ease' }}
            />
          )}
        </svg>

        {/* Checkpoints */}
        {(proposal?.checkpoints || []).map((cp: any) => {
          const done = sim === 'done' || completedSteps >= cp.id;
          const active = sim === 'running' && completedSteps === cp.id - 1;
          return (
            <div
              key={cp.id}
              style={{
                position: 'absolute', left: `${cp.location.x}%`, top: `${cp.location.y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 2,
                background: done ? 'rgba(63,185,80,0.2)' : active ? 'rgba(57,197,207,0.2)' : 'var(--surface-container)',
                border: `2px solid ${done ? 'var(--tertiary)' : active ? 'var(--cyan)' : 'var(--primary)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 900,
                color: done ? 'var(--tertiary)' : active ? 'var(--cyan)' : 'var(--primary)',
                boxShadow: `0 0 15px ${done ? 'rgba(63,185,80,0.3)' : 'rgba(88,166,255,0.3)'}`,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                {done ? '✓' : cp.id}
              </div>
              <span className="font-machine" style={{
                fontSize: 9, fontWeight: 800, color: 'var(--on-surface-variant)',
                background: 'rgba(13,17,23,0.8)', padding: '2px 8px', borderRadius: 2,
                whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {cp.label}
              </span>
            </div>
          );
        })}

        {/* HUD Elements */}
        <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
          <button onClick={onBack} className="layer-4 ghost-border" style={{
            padding: '10px 20px', borderRadius: 4, color: 'var(--on-surface)',
            cursor: 'pointer', fontSize: 12, fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: 10, textTransform: 'uppercase'
          }}>
            <span className="material-symbols-outlined sm">arrow_back</span>
            Abort Mission
          </button>
        </div>

        {sim !== 'idle' && (
          <div className="glass" style={{
            position: 'absolute', top: 24, right: 24, zIndex: 10,
            padding: '12px 24px', borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 1, background: sim === 'done' ? 'var(--tertiary)' : 'var(--cyan)' }} className={sim === 'running' ? 'animate-pulse' : ''} />
            <div className="font-machine">
              <div style={{ fontSize: 11, fontWeight: 900, color: sim === 'done' ? 'var(--tertiary)' : 'var(--cyan)' }}>
                {sim === 'done' ? 'SIMULATION_COMPLETE' : 'LIVE_TELEMETRY_STREAM'}
              </div>
              <div style={{ fontSize: 9, color: 'var(--outline)', marginTop: 2 }}>DRONE_ID: RIDGE-01</div>
            </div>
          </div>
        )}

        {sensorMode !== 'IDLE' && (
          <div style={{
            position: 'absolute', top: 90, right: 24, zIndex: 10,
            padding: '10px 20px', borderRadius: 2,
            background: sensorMode === 'THERMAL' ? 'rgba(255,100,100,0.1)' : 'rgba(100,255,100,0.1)',
            border: `1px solid ${sensorMode === 'THERMAL' ? 'var(--error)' : 'var(--tertiary)'}`,
            color: sensorMode === 'THERMAL' ? 'var(--error)' : 'var(--tertiary)',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'pulse 2s infinite'
          }} className="font-machine">
            <span className="material-symbols-outlined sm">{sensorMode === 'THERMAL' ? 'thermostat' : 'visibility'}</span>
            <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.1em' }}>
              {sensorMode}_SCAN_ACTIVE
            </span>
          </div>
        )}

        <div className="glass" style={{
          position: 'absolute', bottom: 24, left: 24, zIndex: 10,
          padding: '20px 24px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', gap: 40,
        }}>
          {[
            { 
              label: 'BATTERY', 
              value: sim === 'running' ? `${(88 - completedSteps * 0.5 + (Math.random() * 0.4)).toFixed(1)}%` : '88%', 
              color: 'var(--tertiary)' 
            },
            { 
              label: 'ALTITUDE', 
              value: sim === 'running' ? `${(120 + (Math.random() * 2 - 1)).toFixed(0)}m` : '120m', 
              color: 'var(--primary)' 
            },
            { label: 'EST_CONF_Δ', value: '+22%', color: 'var(--secondary)' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', marginBottom: 6, letterSpacing: '0.1em' }}>{stat.label}</div>
              <div className="font-machine" style={{ fontSize: 20, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RIGHT — Plan Feed */}
      <aside style={{
        width: 480, flexShrink: 0,
        borderLeft: '1px solid rgba(255,255,255,0.03)',
        display: 'flex', flexDirection: 'column', zIndex: 20,
      }} className="layer-2">
        <header style={{ padding: '32px 32px 24px', flexShrink: 0 }} className="layer-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>Mission Operations</h1>
            <span className="font-machine" style={{
              fontSize: 10, color: 'var(--primary)', border: '1px solid var(--primary)',
              padding: '4px 10px', borderRadius: 2,
            }}>PROTOTYPE_v4</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
            Validate predictive trajectory for uncertainty resolution in <strong style={{ color: 'var(--on-surface)' }}>{finding.zone}</strong>.
          </p>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Progress List */}
          <section>
            <div className="font-machine" style={{ fontSize: 10, fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>
              Mission Checkpoints
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(proposal?.checkpoints || CHECKPOINTS).map((cp: any, i: number) => {
                const done = sim === 'done' || completedSteps >= cp.id;
                const outcome = results?.outcomes.find((o: any) => o.checkpoint_id === cp.id);
                return (
                  <div key={cp.id} className="layer-3 ghost-border" style={{
                    padding: 20, borderRadius: 4,
                    borderLeft: `3px solid ${done ? 'var(--tertiary)' : 'var(--outline)'}`,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="font-machine" style={{ fontSize: 11, fontWeight: 900, color: done ? 'var(--tertiary)' : 'var(--outline)' }}>
                          [{cp.id}]
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 800 }}>{cp.label}</span>
                      </div>
                      {done && <span className="material-symbols-outlined fill sm" style={{ color: 'var(--tertiary)' }}>check_circle</span>}
                    </div>
                    <div style={{ marginTop: 8, paddingLeft: 30 }}>
                      <div className="font-machine" style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>{cp.purpose}</div>
                      {outcome && done && (
                        <div style={{
                          marginTop: 12, padding: '12px 16px', borderRadius: 2,
                          background: 'rgba(0,0,0,0.2)',
                          fontSize: 12, color: outcome.status === 'warn' ? 'var(--amber)' : 'var(--tertiary)',
                          lineHeight: 1.5, fontWeight: 600
                        }} className="font-machine">
                          {outcome.observation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AI Synthesis */}
          <section>
            <div className="layer-3 ghost-border" style={{ padding: 24, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
              <div className="ai-gradient" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 className="font-machine" style={{ fontSize: 11, fontWeight: 900, color: 'var(--secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Predicted Impact
                </h3>
                <div style={{ fontSize: 14, color: 'var(--on-surface)', lineHeight: 1.6, fontWeight: 500 }}>
                  {proposal?.predicted_impact || 'Analyzing tactical advantage...'}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        {sim === 'idle' && (
          <footer style={{ padding: '24px 32px 32px', flexShrink: 0 }} className="layer-3">
            {error && (
              <div style={{ 
                padding: '12px 16px', borderRadius: 4, background: 'rgba(248,81,73,0.1)', 
                color: 'var(--error)', fontSize: 12, marginBottom: 16, border: '1px solid rgba(248,81,73,0.2)',
                textAlign: 'center'
              }} className="font-machine">
                {error}
              </div>
            )}
            <button
              onClick={startSim}
              style={{
                width: '100%', padding: '18px', borderRadius: 4, border: 'none',
                background: 'var(--primary)', color: 'var(--bg)',
                fontSize: 14, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                boxShadow: '0 8px 24px rgba(88,166,255,0.2)',
                textTransform: 'uppercase'
              }}
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              {error ? 'Retry Mission Launch' : 'Launch Mission Simulation'}
            </button>
          </footer>
        )}

        {sim === 'done' && (
          <footer style={{ padding: '24px 32px 32px', flexShrink: 0 }} className="layer-3">
            <button
              onClick={finalizeMission}
              disabled={isFinalizing}
              style={{
                width: '100%', padding: '18px', borderRadius: 4, border: 'none',
                background: 'var(--tertiary)', color: 'var(--bg)',
                fontSize: 14, fontWeight: 900, cursor: isFinalizing ? 'wait' : 'pointer', letterSpacing: '0.1em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                boxShadow: '0 8px 24px rgba(63,185,80,0.3)',
                textTransform: 'uppercase',
                opacity: isFinalizing ? 0.7 : 1
              }}
              className={!isFinalizing ? "animate-pulse" : ""}
            >
              <span className="material-symbols-outlined">{isFinalizing ? 'sync' : 'verified'}</span>
              {isFinalizing ? 'UPDATING FINDING...' : 'Finalize Analysis & Sync Hub'}
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
