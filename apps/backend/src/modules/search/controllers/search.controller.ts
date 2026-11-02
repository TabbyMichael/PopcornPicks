// Search controller - combined and per-type text search across movies + series.
import { Router } from 'express';
import { asyncRoute, parsePage, parseQuery } from '../../../common/index.js';
import { tmdbService } from '../../tmdb/index.js';

export const searchRouter = Router();

searchRouter.get(
  '/',
  asyncRoute(async (req, res) => {
    const query = parseQuery(req.query.q);
    if (!query) {
      res.status(400).json({ error: 'Query parameter "q" is required.' });
      return;
    }
    res.json(await tmdbService.searchAll(query, parsePage(req.query.page)));
  }),
);

searchRouter.get(
  '/movies',
  asyncRoute(async (req, res) => {
    const query = parseQuery(req.query.q);
    if (!query) {
      res.status(400).json({ error: 'Query parameter "q" is required.' });
      return;
    }
    res.json(await tmdbService.searchMovies(query, parsePage(req.query.page)));
  }),
);

searchRouter.get(
  '/shows',
  asyncRoute(async (req, res) => {
    const query = parseQuery(req.query.q);
    if (!query) {
      res.status(400).json({ error: 'Query parameter "q" is required.' });
      return;
    }
    res.json(await tmdbService.searchShows(query, parsePage(req.query.page)));
  }),
);
