import { MissionProposal, MissionCheckpoint } from './investigation-service';

export interface CheckpointOutcome {
  checkpoint_id: number;
  status: 'ok' | 'warn' | 'error';
  observation: string;
}

export interface MissionResult {
  finding_id: string;
  outcomes: CheckpointOutcome[];
  timestamp: Date;
}

/**
 * Tool for executing investigation missions (Drone/Sensor scans)
 * Simulated version for MVP
 */
export class DroneMissionTool {
  /**
   * Execute a mission based on a proposal
   */
  async execute(proposal: MissionProposal): Promise<MissionResult> {
    // Simulate network/hardware delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const outcomes: CheckpointOutcome[] = proposal.checkpoints.map(cp => {
      return this.simulateCheckpoint(cp);
    });

    return {
      finding_id: proposal.finding_id,
      outcomes,
      timestamp: new Date()
    };
  }

  /**
   * Simulate a single checkpoint outcome based on its purpose
   */
  private simulateCheckpoint(cp: MissionCheckpoint): CheckpointOutcome {
    const label = cp.label.toLowerCase();
    
    if (label.includes('launch')) {
      return {
        checkpoint_id: cp.id,
        status: 'ok',
        observation: 'TAKEOFF SUCCESSFUL — TELEMETRY NOMINAL'
      };
    }

    if (label.includes('perimeter')) {
      return {
        checkpoint_id: cp.id,
        status: 'ok',
        observation: 'VISUAL SCAN COMPLETE. NO PERIMETER BREACH FOUND. MINOR FENCE TENSION ANOMALY DETECTED.'
      };
    }

    if (label.includes('equip')) {
      return {
        checkpoint_id: cp.id,
        status: 'warn',
        observation: 'SENSOR GRID ANOMALY PERSISTS. POSSIBLE CALIBRATION DRIFT OR LOCALIZED INTERFERENCE.'
      };
    }

    if (label.includes('target')) {
      return {
        checkpoint_id: cp.id,
        status: 'ok',
        observation: 'AREA CLEAR. NO UNAUTHORIZED PERSONNEL OR VEHICLES IN TARGET ZONE.'
      };
    }

    return {
      checkpoint_id: cp.id,
      status: 'ok',
      observation: 'CHECKPOINT REACHED. NO ANOMALIES RECORDED.'
    };
  }
}

export const droneMissionTool = new DroneMissionTool();
