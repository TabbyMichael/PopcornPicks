// auth controller - HTTP surface for authentication + the requireAuth guard
// other protected modules (watchlists) reuse. Thin: validate -> service -> json.
import { Router, type NextFunction, type Request, type Response } from 'express';

import type { AuthUser } from '@popcornpicks/types';
import { asyncRoute, UnauthorizedError } from '../../../common/index.js';
import { authService, verifyToken } from '../services/index.js';
import { parseCredentials } from '../validators/index.js';

/** Express request after requireAuth has run. */
export interface AuthedRequest extends Request {
  user?: AuthUser;
}

export const authRouter = Router();

authRouter.post(
  '/register',
  asyncRoute(async (req, res: Response) => {
    const { email, password } = parseCredentials(req.body);
    res.status(201).json(await authService.register(email, password));
  }),
);

authRouter.post(
  '/login',
  asyncRoute(async (req, res: Response) => {
    const { email, password } = parseCredentials(req.body);
    res.json(await authService.login(email, password));
  }),
);

/** Verifies the Bearer JWT and attaches the user; otherwise 401. */
export function requireAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    next(new UnauthorizedError('Missing bearer token.'));
    return;
  }
  let payload: ReturnType<typeof verifyToken>;
  try {
    payload = verifyToken(token);
  } catch (err) {
    next(err);
    return;
  }
  authService
    .me(payload.sub)
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Account no longer exists.'));
        return;
      }
      req.user = user;
      next();
    })
    .catch(next);
}

authRouter.get('/me', requireAuth, asyncRoute(async (req: AuthedRequest, res: Response) => {
  res.json({ user: req.user });
}));
