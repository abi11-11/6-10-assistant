import Fastify from 'fastify';
import { findingsRoutes } from './handlers/findings';
import { findingsRepository } from './repository/findings-repository';
import { initializeSeededFindings } from './services/seeding-service';
import * as dotenv from 'dotenv';
import { getPostgreSQLConnection, getPostgreSQLEventStore } from '@event-driven-io/emmett-postgresql';

// Load environment variables
dotenv.config({ path: '.env.local' });

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';
const DATABASE_URL = process.env.DATABASE_URL;

async function start() {
  // Initialize repository with seeded findings
  const seededFindings = initializeSeededFindings();
  findingsRepository.initialize(seededFindings);

  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  // Initialize Emmett Event Store
  if (!DATABASE_URL) {
    fastify.log.warn('DATABASE_URL not found in environment. Event store will not be available.');
  } else {
    try {
      const connection = getPostgreSQLConnection({ connectionString: DATABASE_URL });
      const eventStore = getPostgreSQLEventStore(connection);
      
      // Basic connectivity test
      await connection.query('SELECT 1');
      fastify.log.info('Successfully connected to PostgreSQL Event Store');
    } catch (err) {
      fastify.log.error('Failed to connect to PostgreSQL Event Store:', err);
      // We don't exit here to allow the API to run in in-memory mode if needed
    }
  }

  // Root route
  fastify.get('/', async (_request, reply) => {
    return reply.send({ 
      status: 'ok',
      message: '6:10 Assistant API',
      endpoints: ['/health', '/findings', '/briefing'],
    });
  });

  // Health check
  fastify.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok' });
  });

  // Test HTML page - shows findings as plain HTML
  fastify.get('/test-page', async (_request, reply) => {
    const findings = findingsRepository.findAll();
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>6:10 Test Page</title>
        <style>
          body { font-family: Arial; margin: 20px; background: #f5f5f5; }
          h1 { color: #333; }
          .finding { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; }
          .title { font-weight: bold; font-size: 16px; }
          .confidence { color: #666; font-size: 14px; margin-top: 5px; }
          .success { padding: 20px; background: #e8f5e9; border: 2px solid #388e3c; border-radius: 4px; margin-bottom: 20px; }
          pre { background: #f5f5f5; padding: 10px; overflow: auto; }
        </style>
      </head>
      <body>
        <h1>6:10 Assistant - Test Page</h1>
        <div class="success">
          <strong>✓ Backend is working! Found ${findings.length} findings</strong>
        </div>
        ${findings.map((f) => `
          <div class="finding">
            <div class="title">${f.title}</div>
            <div class="confidence">Confidence: ${(f.confidence * 100).toFixed(0)}% | Status: ${f.status}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;
    return reply.type('text/html').send(html);
  });

  // Register routes
  fastify.register(findingsRoutes);

  // CORS headers (basic, MVP)
  fastify.register(async (fastify) => {
    fastify.addHook('onSend', async (_request, reply) => {
      reply.header('Access-Control-Allow-Origin', '*');
      reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      reply.header('Access-Control-Allow-Headers', 'Content-Type');
    });
  });

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`Server running at http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
