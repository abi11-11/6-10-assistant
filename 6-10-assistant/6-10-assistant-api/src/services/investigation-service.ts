import { Finding } from './seeding-service';
import { MissionResult } from './drone-mission-tool';

export interface MissionCheckpoint {
  id: number;
  label: string;
  purpose: string;
  resolves: string;
  location: { x: number; y: number };
}

export interface MissionProposal {
  finding_id: string;
  checkpoints: MissionCheckpoint[];
  predicted_impact: string;
}

// Map zones to canonical coordinates
const ZONE_COORDINATES: Record<string, { x: number; y: number }> = {
  LAUNCH: { x: 18, y: 72 },
  PERIMETER: { x: 42, y: 48 },
  EQUIPMENT: { x: 67, y: 64 },
  TARGET: { x: 87, y: 30 },
  UPLOAD: { x: 92, y: 25 },
};

/**
 * Service for analyzing finding uncertainty and planning evidence collection missions
 */
export class InvestigationService {
  /**
   * Generate a mission proposal based on a finding's unresolved questions
   */
  generateProposal(finding: Finding): MissionProposal {
    const checkpoints: MissionCheckpoint[] = [];
    
    // Launch point (default)
    checkpoints.push({
      id: 1,
      label: 'LAUNCH',
      purpose: 'DEPLOYMENT FROM MAIN HANGAR',
      resolves: 'N/A — INITIALIZATION',
      location: ZONE_COORDINATES.LAUNCH
    });

    // If no specific questions, add a general investigative sweep
    if (finding.unresolved_questions.length === 0) {
      checkpoints.push({
        id: 2,
        label: 'GENERAL_SWEEP',
        purpose: 'ROUTINE 360-DEGREE SCAN OF INCIDENT ZONE',
        resolves: 'ENVIRONMENTAL BASELINE VERIFICATION',
        location: ZONE_COORDINATES.PERIMETER
      });
    }

    // Map keywords in questions to specific mission checkpoints
    finding.unresolved_questions.forEach((question, index) => {
      const q = question.toLowerCase();
      
      if (q.includes('breach') || q.includes('fence') || q.includes('cut') || q.includes('perimeter')) {
        checkpoints.push({
          id: checkpoints.length + 1,
          label: `PERIMETER_SCAN_${index}`,
          purpose: 'THERMAL AND VISUAL INSPECTION OF FENCE LINE',
          resolves: 'PHYSICAL BREACH VERIFICATION',
          location: ZONE_COORDINATES.PERIMETER
        });
      } else if (q.includes('camera') || q.includes('sensor') || q.includes('equipment') || q.includes('malfunction')) {
        checkpoints.push({
          id: checkpoints.length + 1,
          label: `EQUIP_CHECK_${index}`,
          purpose: 'EXTERNAL DIAGNOSTIC AND PROXIMITY SCAN',
          resolves: 'HARDWARE MALFUNCTION VS TAMPERING',
          location: ZONE_COORDINATES.EQUIPMENT
        });
      } else if (q.includes('who') || q.includes('personnel') || q.includes('vehicle') || q.includes('identify')) {
        checkpoints.push({
          id: checkpoints.length + 1,
          label: `TARGET_RECON_${index}`,
          purpose: 'HIGH-RESOLUTION TRACKING AND IDENTITY RECON',
          resolves: 'THREAT IDENTIFICATION',
          location: ZONE_COORDINATES.TARGET
        });
      }
    });

    // Final data upload
    checkpoints.push({
      id: checkpoints.length + 1,
      label: 'DATA_UPLOAD',
      purpose: 'BURST TRANSMISSION TO HUB',
      resolves: 'STATE SYNCHRONIZATION',
      location: ZONE_COORDINATES.UPLOAD
    });

    const questionCount = finding.unresolved_questions.length;
    const impactPercent = questionCount > 0 ? (0.1 * questionCount * 100).toFixed(0) : '5';

    return {
      finding_id: finding.id,
      checkpoints,
      predicted_impact: `Completion of this mission is predicted to resolve ${questionCount || 1} uncertainty vector(s) and increase confidence by approximately ${impactPercent}%.`
    };
  }

  /**
   * Finalize a mission by merging results back into the finding
   */
  finalizeMission(finding: Finding, result: MissionResult): Finding {
    const updatedFinding = { ...finding };

    if (!result || !result.outcomes) {
      return updatedFinding;
    }

    // 1. Merge observations into description
    const observations = result.outcomes
      .filter(o => o.status !== 'ok' || o.observation.includes('DETECTED') || o.observation.includes('ANOMALY'))
      .map(o => `[Mission Checkpoint ${o.checkpoint_id}] ${o.observation}`)
      .join('\n');

    if (observations) {
      updatedFinding.description += `\n\n--- MISSION UPDATE (${new Date().toLocaleTimeString()}) ---\n${observations}`;
    }

    // 2. Clear unresolved questions (simulated: clear 1 question per mission)
    if (updatedFinding.unresolved_questions.length > 0) {
      updatedFinding.unresolved_questions = updatedFinding.unresolved_questions.slice(0, -1);
    }

    // 3. Boost confidence (simulated: +12% boost, cap at 98%)
    updatedFinding.confidence = Math.min(0.98, updatedFinding.confidence + 0.12);

    // 4. Update status
    updatedFinding.status = 'READY_FOR_REVIEW';

    return updatedFinding;
  }
}

export const investigationService = new InvestigationService();
