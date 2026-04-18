/** API Client for 6:10 Assistant */

import axios from 'axios';

// Use relative paths that Vite will proxy to backend
const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Finding {
  id: string;
  title: string;
  description?: string;
  status: string;
  confidence: number;
  evidence_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Briefing {
  summary: string;
  findings: Finding[];
  key_decisions: unknown[];
  recommended_actions: string[];
  unresolved_uncertainties: string[];
  generated_at: string;
}

export const findingsApi = {
  // Get all findings
  getFindings: async (): Promise<Finding[]> => {
    const response = await apiClient.get('/findings');
    return response.data;
  },

  // Get single finding with evidence lineage
  getFinding: async (id: string): Promise<Finding> => {
    const response = await apiClient.get(`/findings/${id}`);
    return response.data;
  },

  // Submit human review decision
  reviewFinding: async (id: string, decision: {
    decision: string;
    rationale: string;
    reviewer_id: string;
  }) => {
    const response = await apiClient.post(`/findings/${id}/review`, decision);
    return response.data;
  },

  // Get morning briefing
  getBriefing: async (): Promise<Briefing> => {
    const response = await apiClient.get('/briefing');
    return response.data;
  },
};
