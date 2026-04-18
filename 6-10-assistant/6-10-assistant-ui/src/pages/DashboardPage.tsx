import React from 'react';
import { SEEDED_FINDINGS } from '../data/findings';

export function DashboardPage() {
  const approvedCount = SEEDED_FINDINGS.filter(f => f.status === 'APPROVED').length;
  const criticalCount = SEEDED_FINDINGS.filter(f => f.severity === 'critical').length;

  return (
    <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto', position: 'relative' }} className="layer-0">
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(88,166,255,0.03) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <header style={{ marginBottom: 48, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: 1, background: 'var(--tertiary)' }} className="animate-pulse" />
          <div className="font-machine" style={{ fontSize: 10, color: 'var(--tertiary)', letterSpacing: '0.2em', fontWeight: 900 }}>SYSTEM_ONLINE</div>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
          Command Dashboard
        </h1>
        <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined sm" style={{ color: 'var(--outline)' }}>location_on</span>
            <span style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 600 }}>Ridgeway Logistics Center</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined sm" style={{ color: 'var(--outline)' }}>schedule</span>
            <span className="font-machine" style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>06:10:44 AM</span>
          </div>
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 48, position: 'relative', zIndex: 1 }}>
        {[
          { label: 'ACTIVE_INCIDENTS', value: SEEDED_FINDINGS.length, color: 'var(--primary)', icon: 'sensors', trend: '+2' },
          { label: 'CRITICAL_ALERTS', value: criticalCount, color: 'var(--error)', icon: 'warning', trend: 'STABLE' },
          { label: 'INTEL_READY', value: approvedCount, color: 'var(--tertiary)', icon: 'verified', trend: 'HIGH' },
          { label: 'DRONE_FLEET', value: '4/4', color: 'var(--secondary)', icon: 'flight', trend: 'READY' },
        ].map(stat => (
          <div key={stat.label} className="layer-1 ghost-border" style={{ padding: '24px 28px', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="font-machine" style={{ fontSize: 10, fontWeight: 800, color: 'var(--outline)', letterSpacing: '0.1em' }}>{stat.label}</div>
              <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: 20 }}>{stat.icon}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <div className="font-machine" style={{ fontSize: 36, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1 }}>{stat.value}</div>
              <div className="font-machine" style={{ fontSize: 10, color: stat.color, paddingBottom: 4, fontWeight: 800 }}>{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, position: 'relative', zIndex: 1 }}>
        {/* Left: Activity Monitor */}
        <section className="layer-1 ghost-border" style={{ borderRadius: 4, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="font-machine" style={{ fontSize: 11, fontWeight: 900, color: 'var(--outline)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Intelligence Activity Stream
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} className="animate-pulse" />
              <span className="font-machine" style={{ fontSize: 9, color: 'var(--primary)' }}>LIVE_FEED</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SEEDED_FINDINGS.map((f, i) => (
              <div key={f.id} style={{ display: 'flex', gap: 16, alignItems: 'center', opacity: i > 2 ? 0.5 : 1 }}>
                <div className="font-machine" style={{ fontSize: 9, color: 'var(--outline)', width: 60 }}>{f.timestamp}</div>
                <div style={{ width: 8, height: 8, borderRadius: 1, background: f.severity === 'critical' ? 'var(--error)' : 'var(--primary)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.title}</div>
                  <div className="font-machine" style={{ fontSize: 10, color: 'var(--outline)', marginTop: 2 }}>ZONE: {f.zone} // STATUS: {f.status}</div>
                </div>
                <span className="material-symbols-outlined sm" style={{ color: 'var(--outline)' }}>chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Security Posture */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="layer-1 ghost-border" style={{ padding: 24, borderRadius: 4, flex: 1 }}>
            <h2 className="font-machine" style={{ fontSize: 11, fontWeight: 900, color: 'var(--outline)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }}>
              Security Posture
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Perimeter Integrity', value: 94, color: 'var(--tertiary)' },
                { label: 'Network Latency', value: 12, valueSuffix: 'ms', color: 'var(--primary)' },
                { label: 'Threat Probability', value: 4, color: 'var(--error)' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    <span className="font-machine" style={{ fontSize: 11, fontWeight: 800, color: item.color }}>{item.value}{item.valueSuffix || '%'}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--surface-highest)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${item.label === 'Threat Probability' ? 100 - item.value : item.value}%`, height: '100%', background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="layer-1 ghost-border" style={{ padding: 24, borderRadius: 4, background: 'var(--surface-dim)' }}>
            <h3 className="font-machine" style={{ fontSize: 10, fontWeight: 900, color: 'var(--secondary)', marginBottom: 12, letterSpacing: '0.1em' }}>AGENT_STATUS</h3>
            <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
              All reasoning engines operational. Monitoring 3 high-probability anomalies in sector B-4.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
