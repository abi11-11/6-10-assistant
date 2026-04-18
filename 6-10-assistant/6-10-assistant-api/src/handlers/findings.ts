import { FastifyInstance } from 'fastify';
import { findingsRepository } from '../repository/findings-repository';
import { investigationService } from '../services/investigation-service';
import { droneMissionTool } from '../services/drone-mission-tool';

/**
 * Findings API Routes
 * Endpoints for investigation workflow
 */

export async function findingsRoutes(fastify: FastifyInstance) {
  // POST /findings/:id/mission/execute - Trigger drone mission for evidence collection
  fastify.post<{ Params: { id: string } }>('/findings/:id/mission/execute', {
    schema: {
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const finding = findingsRepository.getById(id);
      if (!finding) {
        return reply.status(404).send({ error: 'Finding not found' });
      }

      // 1. Generate proposal
      const proposal = investigationService.generateProposal(finding);
      
      // 2. Execute mission (simulated)
      const result = await droneMissionTool.execute(proposal);

      return reply.send({
        proposal,
        result
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // POST /findings/:id/mission/finalize - Merge mission results and update finding
  fastify.post<{ Params: { id: string }, Body: { result: any } }>('/findings/:id/mission/finalize', {
    schema: {
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: { result: { type: 'object' } },
        required: ['result'],
      },
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { result } = request.body;
      const finding = findingsRepository.getById(id);
      if (!finding) {
        return reply.status(404).send({ error: 'Finding not found' });
      }

      const updatedFinding = investigationService.finalizeMission(finding, result);
      findingsRepository.save(updatedFinding);

      return reply.send(updatedFinding);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // GET /findings - List all findings with status
  fastify.get('/findings', async (request, reply) => {
    try {
      const findings = findingsRepository.findAll();
      return reply.send(findings);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // GET /findings/:id/proposal - Generate mission proposal for uncertainty resolution
  fastify.get<{ Params: { id: string } }>('/findings/:id/proposal', {
    schema: {
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const finding = findingsRepository.getById(id);
      if (!finding) {
        return reply.status(404).send({ error: 'Finding not found' });
      }
      
      const proposal = investigationService.generateProposal(finding);
      return reply.send(proposal);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // GET /findings/:id - Get single finding with evidence lineage
  fastify.get<{ Params: { id: string } }>('/findings/:id', {
    schema: {
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const finding = findingsRepository.getById(id);
      if (!finding) {
        return reply.status(404).send({ error: 'Finding not found' });
      }
      return reply.send(finding);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // POST /findings/:id/review - Human decision on finding
  fastify.post<{
    Params: { id: string };
    Body: { action: string; rationale: string; reviewer?: string };
  }>(
    '/findings/:id/review',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        body: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['APPROVED', 'REJECTED', 'REQUIRES_REFINEMENT'] },
            rationale: { type: 'string' },
            reviewer: { type: 'string' },
          },
          required: ['action', 'rationale'],
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { action, rationale, reviewer } = request.body;

        const finding = findingsRepository.getById(id);
        if (!finding) {
          return reply.status(404).send({ error: 'Finding not found' });
        }

        // Update finding status and decision record
        finding.status = action as any;
        finding.decision = {
          action: action as any,
          rationale,
          reviewer: reviewer || 'Maya',
          at: new Date().toLocaleTimeString(),
        };

        findingsRepository.save(finding);

        return reply.send(finding);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );
  // GET /briefing - Generate morning briefing
  fastify.get('/briefing', async (request, reply) => {
    try {
      const findings = findingsRepository.findAll();
      const approvedFindings = findingsRepository.findByStatus('APPROVED');

      const briefing = {
        summary: 'Morning briefing - 6:10 AM',
        findings: approvedFindings,
        key_decisions: approvedFindings.map((f) => ({
          finding_id: f.id,
          title: f.title,
          confidence: f.confidence,
        })),
        recommended_actions: [
          'Check Block C before leadership arrives',
          'Investigate vehicle access near storage yard',
        ],
        unresolved_uncertainties: findings
          .filter((f) => f.confidence < 0.8)
          .flatMap((f) => f.unresolved_questions),
        generated_at: new Date(),
      };

      return reply.send(briefing);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
