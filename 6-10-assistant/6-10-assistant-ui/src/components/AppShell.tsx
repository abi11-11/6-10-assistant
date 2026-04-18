import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
  activePage?: 'dashboard' | 'investigation' | 'briefing' | 'telemetry';
  onNavigate?: (page: 'dashboard' | 'investigation' | 'briefing' | 'telemetry') => void;
  backendStatus?: 'connected' | 'disconnected' | 'checking';
}

export function AppShell({ children, activePage = 'investigation', onNavigate, backendStatus = 'checking' }: AppShellProps) {
  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'var(--tertiary)';
      case 'disconnected': return 'var(--error)';
      default: return 'var(--amber)';
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar omitted for brevity, keeping existing code logic */}
      <nav 
        className="layer-2"
        style={{
          width: 80, flexShrink: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '32px 0',
          borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 40, height: '100vh'
        }}
      >
        <div style={{ height: 40, width: '100%', marginBottom: 32 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', alignItems: 'center', flex: 1 }}>
          {[
            { icon: 'dashboard', label: 'Command', id: 'dashboard' },
            { icon: 'psychology', label: 'Intelligence', id: 'investigation' },
            { icon: 'sensors', label: 'Telemetry', id: 'telemetry' },
            { icon: 'inventory_2', label: 'Archive', id: 'briefing' },
          ].map((item) => {
            const isActive = item.id === activePage;
            return (
              <button
                key={item.icon}
                onClick={() => item.id && onNavigate?.(item.id as any)}
                className={isActive ? 'layer-3' : ''}
                style={{
                  position: 'relative', width: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', padding: '12px 0', gap: 4, border: 'none', cursor: 'pointer',
                  background: 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--outline)',
                  borderRight: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
                title={item.label}
              >
                <span
                  className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}
                  style={{ fontSize: 22 }}
                >
                  {item.icon}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginTop: 'auto' }}>
          {['settings', 'help'].map(icon => (
            <button key={icon} style={{ background: 'none', border: 'none', color: 'var(--outline)', cursor: 'pointer', padding: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
            </button>
          ))}
          <div style={{
            width: 36, height: 36, borderRadius: '50%', overflow: 'hidden',
            border: '1px solid var(--outline-variant)', marginTop: 8
          }}>
            <div style={{ width: '100%', height: '100%', background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>person</span>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header 
          className="layer-0"
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0 24px', height: 56, flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            zIndex: 50,
            boxShadow: '0 4px 32px rgba(88,166,255,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, height: '100%' }}>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--primary)' }}>6:10</div>
            <nav style={{ display: 'flex', height: '100%', gap: 4 }}>
              {(['dashboard', 'investigation', 'briefing', 'telemetry'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => onNavigate?.(p)}
                  className={activePage === p ? 'layer-3' : ''}
                  style={{
                    display: 'flex', alignItems: 'center', height: '100%', padding: '0 12px',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    color: activePage === p ? 'var(--primary)' : 'var(--outline)',
                    fontWeight: activePage === p ? 700 : 500,
                    fontSize: 14,
                    borderBottom: activePage === p ? '2px solid var(--primary)' : '2px solid transparent',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize',
                  }}
                >
                  {p}
                </button>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="font-mono" style={{
              fontSize: 11, color: getStatusColor(), padding: '4px 10px',
              background: 'var(--surface-container)', borderRadius: 4,
              border: `1px solid ${getStatusColor()}44`,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: getStatusColor() }} />
              API: {backendStatus.toUpperCase()}
            </div>
            <div className="font-mono" style={{
              fontSize: 11, color: 'var(--primary)', padding: '4px 10px',
              background: 'var(--surface-container)', borderRadius: 4,
              border: '1px solid var(--outline-variant)'
            }}>
              SYS.TIME: 06:10:00 UTC
            </div>
            {['notifications', 'schedule'].map(icon => (
              <button key={icon} style={{ background: 'none', border: 'none', color: 'var(--outline)', cursor: 'pointer', padding: 8, borderRadius: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
              </button>
            ))}
            <div style={{ position: 'relative', marginLeft: 8 }}>
              <span className="material-symbols-outlined" style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                fontSize: 14, color: 'var(--outline)', pointerEvents: 'none'
              }}>search</span>
              <input
                placeholder="Query Telemetry..."
                className="font-machine"
                style={{
                  background: 'var(--surface-lowest)', border: '1px solid var(--outline-variant)',
                  color: 'var(--on-surface)', fontSize: 12, borderRadius: 4,
                  paddingLeft: 32, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
                  width: 176, outline: 'none',
                }}
              />
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
