// Common layer: query parsers + typed error classes (Task 8/9 contracts).
import { describe, expect, it } from 'vitest';

import {
  AppError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  UpstreamError,
  ValidationError,
  parseId,
  parsePage,
  parseQuery,
  parseWindow,
} from '../src/common/index.js';

describe('parsePage', () => {
  it('defaults to 1 for undefined/invalid/<=0 values', () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage('abc')).toBe(1);
    expect(parsePage('0')).toBe(1);
    expect(parsePage('-3')).toBe(1);
  });

  it('floors positive page numbers', () => {
    expect(parsePage('4')).toBe(4);
    expect(parsePage(7.9)).toBe(7);
  });
});

describe('parseId', () => {
  it('returns null for non-positive or non-numeric input', () => {
    expect(parseId('nope')).toBeNull();
    expect(parseId('0')).toBeNull();
    expect(parseId('-1')).toBeNull();
  });

  it('floors valid positive ids', () => {
    expect(parseId('550')).toBe(550);
    expect(parseId(12.7)).toBe(12);
  });
});

describe('parseQuery', () => {
  it('trims strings and coerces non-strings to empty', () => {
    expect(parseQuery('  matrix  ')).toBe('matrix');
    expect(parseQuery(undefined)).toBe('');
    expect(parseQuery(42)).toBe('');
  });
});

describe('parseWindow', () => {
  it('only returns day for "day", otherwise week', () => {
    expect(parseWindow('day')).toBe('day');
    expect(parseWindow('week')).toBe('week');
    expect(parseWindow('nonsense')).toBe('week');
    expect(parseWindow(undefined)).toBe('week');
  });
});

describe('typed error classes', () => {
  it('each subclass carries its documented HTTP status and name', () => {
    const cases: Array<[AppError, number, string]> = [
      [new NotFoundError(), 404, 'NotFoundError'],
      [new ValidationError(), 400, 'ValidationError'],
      [new UnauthorizedError(), 401, 'UnauthorizedError'],
      [new ConflictError(), 409, 'ConflictError'],
      [new UpstreamError(), 502, 'UpstreamError'],
    ];
    for (const [err, status, name] of cases) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toBeInstanceOf(Error);
      expect(err.status).toBe(status);
      expect(err.name).toBe(name);
    }
  });

  it('UpstreamError forwards a cause', () => {
    const cause = new Error('socket hang up');
    const err = new UpstreamError('TMDB down', { cause });
    expect(err.cause).toBe(cause);
  });
});
