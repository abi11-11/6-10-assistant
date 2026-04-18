import React from 'react';
import { Finding } from '../data/findings';

interface FacilityMapProps {
  findings: Finding[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function FacilityMap({ findings, selectedId, onSelect }: FacilityMapProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 16px 16px' }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(28,33,40,0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(28,33,40,0.6) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }} />

      {/* Facility schematic */}
      <svg
        viewBox="0 0 200 200"
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}
      >
        {/* Perimeter */}
        <rect x="10" y="10" width="180" height="180" fill="none" stroke="rgba(139,145,157,0.2)" strokeWidth="1" />

        {/* Structures */}
        <rect x="20" y="20" width="70" height="40" fill="rgba(22,27,34,0.8)" stroke="rgba(139,145,157,0.25)" strokeWidth="0.5" />
        <text x="30" y="44" fontSize="5" fill="rgba(139,145,157,0.5)" fontFamily="JetBrains Mono, monospace">ADMIN</text>

        <rect x="20" y="120" width="55" height="55" fill="rgba(22,27,34,0.8)" stroke="rgba(139,145,157,0.25)" strokeWidth="0.5" />
        <text x="26" y="150" fontSize="5" fill="rgba(139,145,157,0.5)" fontFamily="JetBrains Mono, monospace">BLOCK-C</text>

        <rect x="100" y="120" width="50" height="60" fill="rgba(22,27,34,0.8)" stroke="rgba(139,145,157,0.25)" strokeWidth="0.5" />
        <text x="104" y="152" fontSize="5" fill="rgba(139,145,157,0.5)" fontFamily="JetBrains Mono, monospace">YARD-B</text>

        <rect x="80" y="55" width="40" height="40" fill="rgba(22,27,34,0.8)" stroke="rgba(139,145,157,0.25)" strokeWidth="0.5" />
        <text x="83" y="78" fontSize="5" fill="rgba(139,145,157,0.5)" fontFamily="JetBrains Mono, monospace">DC-01</text>

        {/* Gate 3 */}
        <rect x="180" y="100" width="10" height="30" fill="rgba(88,166,255,0.05)" stroke="rgba(88,166,255,0.2)" strokeWidth="0.5" />
        <text x="154" y="116" fontSize="4.5" fill="rgba(88,166,255,0.5)" fontFamily="JetBrains Mono, monospace">GATE-03</text>

        {/* Connecting paths */}
        <line x1="90" y1="40" x2="100" y2="55" stroke="rgba(139,145,157,0.1)" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="120" y1="95" x2="120" y2="120" stroke="rgba(139,145,157,0.1)" strokeWidth="0.5" strokeDasharray="3,3" />

        {/* Finding markers */}
        {(findings || []).map(f => {
          if (!f || !f.map_zone) return null;
          const isSelected = f.id === selectedId;
          const pct = f.confidence ?? 0;
          const color = pct >= 0.7 ? '#3FB950' : pct >= 0.4 ? '#D29922' : '#F85149';
          const r = isSelected ? 6 : 4;
          const x = (f.map_zone.x ?? 0) * 2;
          const y = (f.map_zone.y ?? 0) * 2;

          return (
            <g key={f.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(f.id)}>
              {isSelected && (
                <circle cx={x} cy={y} r={r + 6} fill={color} opacity={0.15} />
              )}
              <circle
                cx={x} cy={y} r={r}
                fill={color}
                stroke={isSelected ? color : 'transparent'}
                strokeWidth={1.5}
                opacity={isSelected ? 1 : 0.75}
                style={{ filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none' }}
              />
              {isSelected && (
                <text x={x + 8} y={y + 3} fontSize="5" fill={color} fontFamily="JetBrains Mono, monospace">
                  {f.map_zone.label ?? 'UNKNOWN'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
