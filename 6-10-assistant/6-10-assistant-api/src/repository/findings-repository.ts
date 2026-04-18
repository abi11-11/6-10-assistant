import { Finding } from '../services/seeding-service';

/**
 * In-memory repository for findings (MVP)
 * Later: replace with PostgreSQL event store
 */
export class FindingsRepository {
  private findings: Map<string, Finding> = new Map();

  /**
   * Initialize repository with seeded findings
   */
  initialize(initialFindings: Finding[]): void {
    initialFindings.forEach((finding) => {
      this.findings.set(finding.id, finding);
    });
  }

  /**
   * Get all findings
   */
  findAll(): Finding[] {
    return Array.from(this.findings.values());
  }

  /**
   * Get finding by ID
   */
  getById(id: string): Finding | undefined {
    return this.findings.get(id);
  }

  /**
   * Save or update finding
   */
  save(finding: Finding): void {
    this.findings.set(finding.id, {
      ...finding,
      updated_at: new Date(),
    });
  }

  /**
   * Get findings by status
   */
  findByStatus(status: string): Finding[] {
    return Array.from(this.findings.values()).filter(
      (f) => f.status === status,
    );
  }

  /**
   * Update finding status with timestamp
   */
  updateStatus(id: string, status: string): Finding | undefined {
    const finding = this.findings.get(id);
    if (finding) {
      finding.status = status;
      finding.updated_at = new Date();
      this.findings.set(id, finding);
      return finding;
    }
    return undefined;
  }
}

// Singleton instance
export const findingsRepository = new FindingsRepository();
