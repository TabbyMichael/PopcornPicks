// Backend entrypoint - re-exports app wiring; run src/bootstrap/index.ts for the server.
export { createApp, startServer } from './bootstrap/index.js';
export { tmdbService } from './modules/tmdb/services/index.js';
export type { Movie, Show, TitlePage } from './modules/tmdb/services/index.js';
