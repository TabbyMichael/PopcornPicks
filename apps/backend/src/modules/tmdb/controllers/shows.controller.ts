// Shows controller - HTTP routes for TV series, backed by the tmdb service.
import { Router } from 'express';
import { asyncRoute, parseId, parsePage, parseWindow } from '../../../common/index.js';
import { tmdbService } from '../services/index.js';

export const showsRouter = Router();

showsRouter.get(
  '/trending',
  asyncRoute(async (req, res) => {
    res.json(await tmdbService.getTrendingShows(parseWindow(req.query.window)));
  }),
);

showsRouter.get(
  '/popular',
  asyncRoute(async (req, res) => {
    res.json(await tmdbService.getPopularShows(parsePage(req.query.page)));
  }),
);

showsRouter.get(
  '/top-rated',
  asyncRoute(async (req, res) => {
    res.json(await tmdbService.getTopRatedShows(parsePage(req.query.page)));
  }),
);

showsRouter.get(
  '/search',
  asyncRoute(async (req, res) => {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query) {
      res.status(400).json({ error: 'Query parameter "q" is required.' });
      return;
    }
    res.json(await tmdbService.searchShows(query, parsePage(req.query.page)));
  }),
);

showsRouter.get(
  '/:id',
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: 'Invalid show id.' });
      return;
    }
    res.json(await tmdbService.getShowById(id));
  }),
);
