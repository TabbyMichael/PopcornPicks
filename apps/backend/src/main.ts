// Process entrypoint - the only place that actually opens a listening socket.
// Kept separate from `createApp()` so tests can build the app with supertest
// without starting a server or connecting to anything.
import { startServer } from './bootstrap/index.js';

startServer();
