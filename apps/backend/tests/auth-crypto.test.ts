// auth service crypto: scrypt password hashing + JWT issue/verify. These are the
// pure, dependency-free halves of auth - no DB or network involved.
import { describe, expect, it } from 'vitest';

import type { AuthUser } from '@popcornpicks/types';
import { UnauthorizedError } from '../src/common/index.js';
import {
  hashPassword,
  signToken,
  verifyPassword,
  verifyToken,
} from '../src/modules/auth/services/index.js';

describe('hashPassword / verifyPassword', () => {
  it('round-trips a correct password', async () => {
    const hash = await hashPassword('correct horse battery');
    expect(hash.startsWith('scrypt$')).toBe(true);
    expect(await verifyPassword('correct horse battery', hash)).toBe(true);
  });

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('s3cret');
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });

  it('produces a distinct salt per hash (same password -> different stored value)', async () => {
    const a = await hashPassword('same');
    const b = await hashPassword('same');
    expect(a).not.toBe(b);
    expect(await verifyPassword('same', a)).toBe(true);
    expect(await verifyPassword('same', b)).toBe(true);
  });

  it('returns false for malformed stored hashes instead of throwing', async () => {
    expect(await verifyPassword('x', 'bcrypt$dead$beef')).toBe(false);
    expect(await verifyPassword('x', 'garbage')).toBe(false);
    expect(await verifyPassword('x', 'scrypt$')).toBe(false);
  });
});

describe('signToken / verifyToken', () => {
  it('round-trips the subject and email through a signed JWT', () => {
    const user: AuthUser = { id: 'user-123', email: 'movie.fan@example.com', createdAt: '2026-01-01T00:00:00.000Z' };
    const token = signToken(user);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const payload = verifyToken(token);
    expect(payload.sub).toBe(user.id);
    expect(payload.email).toBe(user.email);
  });

  it('throws UnauthorizedError for a tampered/garbage token', () => {
    expect(() => verifyToken('not.a.jwt')).toThrow(UnauthorizedError);
  });
});
