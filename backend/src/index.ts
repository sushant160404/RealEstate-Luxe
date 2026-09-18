import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import { initDb } from './db.js';
import { adminRouter } from './routes/admin.js';
import { agentRouter } from './routes/agent.js';
import { inquiriesRouter } from './routes/inquiries.js';
import { mortgageRouter } from './routes/mortgage.js';
import { newsletterRouter } from './routes/newsletter.js';
import { propertiesRouter } from './routes/properties.js';
import { toursRouter } from './routes/tours.js';
import { whatsappRouter } from './routes/whatsapp.js';

async function main() {
  await initDb();

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // required on Render/behind a reverse proxy for correct rate-limiting/IPs

  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(
    morgan(config.nodeEnv === 'production' ? 'combined' : 'dev', {
      skip: (req) => req.path === '/api/health' || req.path === '/health',
    })
  );

  app.use(
    cors({
      origin(origin, callback) {
        // Allow same-origin/non-browser requests (no Origin header), and any configured frontend origin.
        if (!origin || config.frontendUrls.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} is not allowed by CORS.`));
        }
      },
      credentials: true,
    })
  );

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', apiLimiter);

  // Health checks (used by Render)
  app.get(['/health', '/api/health'], (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), env: config.nodeEnv });
  });

  app.use('/api/properties', propertiesRouter);
  app.use('/api/tours', toursRouter);
  app.use('/api/inquiries', inquiriesRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/agent', agentRouter);
  app.use('/api/mortgage', mortgageRouter);
  app.use('/api/admin/whatsapp', whatsappRouter);
  app.use('/api/admin', adminRouter);

  app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'API route not found.' });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  });

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`LuxeLiving API listening on port ${config.port} [${config.nodeEnv}]`);
    // eslint-disable-next-line no-console
    console.log(`Allowed frontend origins: ${config.frontendUrls.join(', ')}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', err);
  process.exit(1);
});
