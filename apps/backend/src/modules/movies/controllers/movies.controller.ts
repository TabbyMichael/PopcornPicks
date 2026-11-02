// Movies controller - HTTP routes for movies, backed by the tmdb module.
import { Router } from 'express';
import { asyncRoute, parseId, parsePage, parseQuery, parseWindow } from '../../../common/index.js';
import { tmdbService } from '../../tmdb/index.js';

export const moviesRouter = Router();

moviesRouter.get(
  '/trending',
  asyncRoute(async (req, res) => {
    res.json(await tmdbService.getTrendingMovies(parseWindow(req.query.window)));
  }),
);

moviesRouter.get(
  '/popular',
  asyncRoute(async (req, res) => {
    res.json(await tmdbService.getPopularMovies(parsePage(req.query.page)));
  }),
);

moviesRouter.get(
  '/top-rated',
  asyncRoute(async (req, res) => {
    res.json(await tmdbService.getTopRatedMovies(parsePage(req.query.page)));
  }),
);

moviesRouter.get(
  '/upcoming',
  asyncRoute(async (req, res) => {
    res.json(await tmdbService.getUpcomingMovies(parsePage(req.query.page)));
  }),
);

moviesRouter.get(
  '/search',
  asyncRoute(async (req, res) => {
    const query = parseQuery(req.query.q);
    if (!query) {
      res.status(400).json({ error: 'Query parameter "q" is required.' });
      return;
    }
    res.json(await tmdbService.searchMovies(query, parsePage(req.query.page)));
  }),
);

// Static path - registered before the /:id routes so it matches first.
moviesRouter.get(
  '/genres',
  asyncRoute(async (_req, res) => {
    res.json({ genres: await tmdbService.getMovieGenres() });
  }),
);

moviesRouter.get(
  '/:id/details',
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: 'Invalid movie id.' });
      return;
    }
    res.json(await tmdbService.getMovieDetails(id));
  }),
);

moviesRouter.get(
  '/:id/credits',
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: 'Invalid movie id.' });
      return;
    }
    res.json({ credits: await tmdbService.getMovieCredits(id) });
  }),
);

moviesRouter.get(
  '/:id/videos',
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: 'Invalid movie id.' });
      return;
    }
    res.json({ videos: await tmdbService.getMovieVideos(id) });
  }),
);

moviesRouter.get(
  '/:id/similar',
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: 'Invalid movie id.' });
      return;
    }
    res.json(await tmdbService.getMovieSimilar(id, parsePage(req.query.page)));
  }),
);

moviesRouter.get(
  '/:id/recommendations',
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: 'Invalid movie id.' });
      return;
    }
    res.json(await tmdbService.getMovieRecommendations(id, parsePage(req.query.page)));
  }),
);

moviesRouter.get(
  '/:id',
  asyncRoute(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: 'Invalid movie id.' });
      return;
    }
    res.json(await tmdbService.getMovieById(id));
  }),
);
