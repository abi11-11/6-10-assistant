import React, { useState, useEffect } from 'react';
import './index.css';
import { AppShell } from './components/AppShell';
import { InvestigationPage } from './pages/InvestigationPage';
import { BriefingPage } from './pages/BriefingPage';
import { MissionPage } from './pages/MissionPage';
import { DashboardPage } from './pages/DashboardPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { SEEDED_FINDINGS, Finding } from './data/findings';

type Page = 'dashboard' | 'investigation' | 'briefing' | 'mission' | 'telemetry';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [findings, setFindings] = useState<Finding[]>(SEEDED_FINDINGS);
  const [missionFinding, setMissionFinding] = useState<Finding | null>(null);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    const controller = new AbortController();
    const checkHealth = async () => {
      try {
        const response = await fetch('/findings', { signal: controller.signal });
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setBackendStatus('disconnected');
        }
      }
    };
    checkHealth();
    return () => controller.abort();
  }, []);

  const handleNavigate = (p: 'dashboard' | 'investigation' | 'briefing' | 'telemetry') => {
    setPage(p);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'investigation': return <InvestigationPage onLaunchMission={(f) => { setMissionFinding(f); setPage('mission'); }} />;
      case 'briefing': return <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}><BriefingPage findings={findings} /></div>;
      case 'telemetry': return <TelemetryPage />;
      default: return <InvestigationPage onLaunchMission={(f) => { setMissionFinding(f); setPage('mission'); }} />;
    }
  };

  if (page === 'mission' && missionFinding) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Minimal header for mission page */}
        <div style={{
          padding: '0 24px', height: 56, flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--primary)' }}>6:10</div>
          <span className="font-mono" style={{
            fontSize: 11, color: 'var(--primary)', padding: '3px 10px',
            background: 'var(--surface-container)', borderRadius: 4, border: '1px solid var(--outline-variant)',
          }}>
            MISSION SIMULATION ACTIVE
          </span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <MissionPage
            finding={missionFinding}
            onBack={() => { setPage('investigation'); setMissionFinding(null); }}
            onFinalize={() => { setPage('investigation'); setMissionFinding(null); }}
          />
        </div>
      </div>
    );
  }

  return (
    <AppShell 
      activePage={page === 'mission' ? 'investigation' : (page as 'dashboard' | 'investigation' | 'briefing' | 'telemetry')} 
      onNavigate={handleNavigate}
      backendStatus={backendStatus}
    >
      {renderPage()}
    </AppShell>
  );
}
