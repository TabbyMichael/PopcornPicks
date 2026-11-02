// Common shared utilities across modules.
import type { NextFunction, Request, Response, RequestHandler } from 'express';

/** Base class for every error the API understands; carries an HTTP status. */
export class AppError extends Error {
  readonly status: number;
  readonly cause?: unknown;

  constructor(message: string, status: number, options?: { cause?: unknown }) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.cause = options?.cause;
  }
}

/** Resource does not exist (also used for TMDB 404s). */
export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

/** Client sent invalid or missing input. */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

/** Missing or invalid credentials / token. */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/** Conflict with existing state (e.g. duplicate email). */
export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

/** An upstream service (TMDB) failed to serve the request. */
export class UpstreamError extends AppError {
  constructor(message = 'Upstream request failed', options?: { cause?: unknown }) {
    super(message, 502, options);
  }
}

/** Wraps an async route handler so rejected promises hit the error middleware. */
export function asyncRoute(
  handler: (req: Request, res: Response) => Promise<unknown>,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res)).catch(next);
  };
}

/** Parses a positive page number from a query value, defaulting to 1. */
export function parsePage(raw: unknown): number {
  const page = Number(raw ?? 1);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

/** Parses a positive numeric id from a route param, or null when invalid. */
export function parseId(raw: unknown): number | null {
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? Math.floor(id) : null;
}

/** Reads a trimmed string query param, or empty string when absent. */
export function parseQuery(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim() : '';
}

/** Reads a 'day' | 'week' trending window, defaulting to 'week'. */
export function parseWindow(raw: unknown): 'day' | 'week' {
  return raw === 'day' ? 'day' : 'week';
}
