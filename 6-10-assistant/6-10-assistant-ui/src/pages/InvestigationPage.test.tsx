import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvestigationPage } from './InvestigationPage';

// Mock the global fetch
const mockFindings = [
  {
    id: 'finding-1',
    title: 'Fence Alert Near perimeter-north',
    status: 'READY_FOR_REVIEW',
    severity: 'high',
    icon: 'fence',
    timestamp: '03:15 AM',
    zone: 'NORTH_PERIMETER',
    confidence: 0.62,
    description: 'Fence vibration detected near Gate 3, duration 15 seconds',
    evidence_ids: ['evt-001'],
    unresolved_questions: ['Was this wind, animal, or intentional?'],
    timeline_events: [],
    map_zone: { id: 'z1', label: 'Sector A', x: 20, y: 30 }
  },
  {
    id: 'finding-2',
    title: 'Access Point Anomaly at admin-building',
    status: 'READY_FOR_REVIEW',
    severity: 'critical',
    icon: 'door_open',
    timestamp: '03:20 AM',
    zone: 'ADMIN_BLOCK',
    confidence: 0.78,
    description: 'Three failed badge swipes at access point, door forced at 03:15',
    evidence_ids: ['evt-004'],
    unresolved_questions: ['Who attempted access? Malfunction or break-in?'],
    timeline_events: [],
    map_zone: { id: 'z2', label: 'Sector B', x: 50, y: 60 }
  }
];

global.fetch = vi.fn((url) => {
  if (url === '/api/findings') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockFindings),
    });
  }
  if (url.includes('/review')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ...mockFindings[0], status: 'APPROVED' }),
    });
  }
  return Promise.reject(new Error('Unknown URL'));
}) as any;

describe('InvestigationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render investigation workspace with queue and map', async () => {
    render(<InvestigationPage />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText(/ACTIVE QUEUE/i)).toBeInTheDocument();
    });

    // Verify findings are listed in sidebar
    const sidebar = screen.getByText(/ACTIVE QUEUE/i).closest('aside')!;
    expect(within(sidebar).getByText(/Fence Alert Near perimeter-north/i)).toBeInTheDocument();
    expect(within(sidebar).getByText(/Access Point Anomaly at admin-building/i)).toBeInTheDocument();
  });

  it('should update detail panel when a finding is selected', async () => {
    const user = userEvent.setup();
    render(<InvestigationPage />);

    // Wait for load
    const activeQueueText = await waitFor(() => screen.getByText(/ACTIVE QUEUE/i));
    const sidebar = activeQueueText.closest('aside')!;
    const accessItem = within(sidebar).getByText(/Access Point Anomaly at admin-building/i);

    // Click second item
    await user.click(accessItem);

    // Detail header should update (it will now have 2 instances of the title: sidebar + header)
    await waitFor(() => {
      expect(screen.getAllByText(/Access Point Anomaly at admin-building/i).length).toBeGreaterThan(1);
    });
  });

  it('should open review modal and show decision buttons', async () => {
    const user = userEvent.setup();
    render(<InvestigationPage />);

    // Wait for load
    const reviewButton = await waitFor(() => screen.getByText(/Review Finding/i));
    
    // Open modal
    await user.click(reviewButton);

    // Should see decision options (Approve/Reject)
    expect(screen.getByText(/Approve/i)).toBeInTheDocument();
    expect(screen.getByText(/Reject/i)).toBeInTheDocument();
  });

  it('should display confidence score in detail panel', async () => {
    render(<InvestigationPage />);

    // Wait for load
    await waitFor(() => {
      expect(screen.getByText(/CONFIDENCE_SCORE/i)).toBeInTheDocument();
    });

    // Check value (mockFindings[0].confidence = 0.62)
    expect(screen.getByText(/62.0%/i)).toBeInTheDocument();
  });
});
