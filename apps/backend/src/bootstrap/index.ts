// Bootstrap - Express app wiring and server startup.
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { AppError } from '../common/index.js';
import { assertConfig, config } from '../config/index.js';
import { closePool, pingDatabase } from '../db/index.js';
import { authRouter } from '../modules/auth/controllers/index.js';
import { moviesRouter } from '../modules/movies/controllers/index.js';
import { searchRouter } from '../modules/search/controllers/index.js';
import { showsRouter } from '../modules/tmdb/controllers/index.js';
import { watchlistRouter } from '../modules/watchlists/controllers/index.js';

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  // CORS: echo back only whitelisted origins (config.allowedOrigins / ALLOWED_ORIGINS).
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && config.allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    }
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.get('/health', async (_req, res) => {
    const db = await pingDatabase();
    res.json({ status: 'ok', db: db ? 'ok' : 'not-configured' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/shows', showsRouter);
  app.use('/api/search', searchRouter);
  app.use('/api/watchlists', watchlistRouter);

  // 404 for unknown API routes
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Central error handler - services throw AppError subclasses, we map status here.
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      // Upstream details stay server-side; only the client-safe message is sent.
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

export function startServer(): void {
  assertConfig();
  const server = createApp().listen(config.port, () => {
    console.log(`PopcornPicks backend listening on http://localhost:${config.port}`);
  });

  // Graceful shutdown - drain the pg pool before exiting.
  const shutdown = () => {
    server.close(() => {
      void closePool().finally(() => process.exit(0));
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
