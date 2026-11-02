// watchlists controller - protected CRUD over the user's saved titles.
// Every route runs requireAuth; scoping to the user happens in the service.
import { Router } from 'express';

import { asyncRoute } from '../../../common/index.js';
import { requireAuth, type AuthedRequest } from '../../auth/index.js';
import { watchlistService } from '../services/index.js';
import { parseTmdbId, parseWatchlistEntry } from '../validators/index.js';

export const watchlistRouter = Router();

// All watchlist routes require a valid bearer token.
watchlistRouter.use(requireAuth);

watchlistRouter.get(
  '/items',
  asyncRoute(async (req: AuthedRequest, res) => {
    res.json({ items: await watchlistService.list(req.user!.id) });
  }),
);

watchlistRouter.post(
  '/items',
  asyncRoute(async (req: AuthedRequest, res) => {
    const entry = parseWatchlistEntry(req.body);
    const item = await watchlistService.add(req.user!.id, entry);
    res.status(201).json(item);
  }),
);

// kind is a query param because a title is unique per (tmdb_id, kind).
watchlistRouter.delete(
  '/items/:tmdbId',
  asyncRoute(async (req: AuthedRequest, res) => {
    const tmdbId = parseTmdbId(req.params.tmdbId);
    const kind = req.query.kind === 'series' ? 'series' : 'movie';
    await watchlistService.remove(req.user!.id, tmdbId, kind);
    res.status(204).end();
  }),
);
