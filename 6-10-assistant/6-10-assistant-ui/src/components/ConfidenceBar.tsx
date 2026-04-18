import React from 'react';

interface ConfidenceBarProps {
  value: number; // 0–1
  showLabel?: boolean;
}

export function ConfidenceBar({ value, showLabel = true }: ConfidenceBarProps) {
  const pct = Math.round(value * 100);
  const colorClass = pct >= 70 ? 'conf-high' : pct >= 40 ? 'conf-mid' : 'conf-low';
  const textColor = pct >= 70 ? 'var(--tertiary)' : pct >= 40 ? 'var(--amber)' : 'var(--error)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1, height: 5, background: 'var(--surface-highest)',
        borderRadius: 3, overflow: 'hidden'
      }}>
        <div
          className={colorClass}
          style={{ width: `${pct}%`, height: '100%', borderRadius: 3, transition: 'width 0.4s ease' }}
        />
      </div>
      {showLabel && (
        <span className="font-mono" style={{ fontSize: 12, color: textColor, minWidth: 32, textAlign: 'right' }}>
          {pct}%
        </span>
      )}
    </div>
  );
}
