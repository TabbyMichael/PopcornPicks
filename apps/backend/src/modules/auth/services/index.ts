// auth service - password hashing + JWT issue/verify. The only place that
// knows how credentials are stored and turned into tokens.
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

import type { AuthUser } from '@popcornpicks/types';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { ConflictError, UnauthorizedError } from '../../../common/index.js';
import { config } from '../../../config/index.js';
import { authRepository } from '../repositories/index.js';

const scrypt = promisify(_scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

// scrypt params stored inline so hashes are self-describing: scrypt$<saltHex>$<hashHex>
const KEY_LENGTH = 64;

/** Hashes a password with a fresh random salt using scrypt (no external dep). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

/** Verifies a password against a stored scrypt hash in constant time. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const derived = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length);
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export interface AuthTokenPayload {
  sub: string; // user id
  email: string;
}

/** Signs a JWT for the given user; expires per config.jwtExpiresIn. */
export function signToken(user: AuthUser): string {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not set - auth tokens cannot be signed.');
  }
  const payload: AuthTokenPayload = { sub: user.id, email: user.email };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
}

/** Verifies a JWT and returns its payload, or throws UnauthorizedError. */
export function verifyToken(token: string): AuthTokenPayload {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not set - auth tokens cannot be verified.');
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload | string;
    if (typeof decoded === 'string' || !decoded.sub) {
      throw new UnauthorizedError('Invalid token.');
    }
    return { sub: decoded.sub, email: String(decoded.email ?? '') };
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError('Invalid or expired token.');
  }
}

export const authService = {
  async register(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const normalized = email.toLowerCase().trim();
    const existing = await authRepository.findByEmail(normalized);
    if (existing) {
      throw new ConflictError('An account with that email already exists.');
    }
    const passwordHash = await hashPassword(password);
    const user = await authRepository.create(normalized, passwordHash);
    if (!user) throw new Error('User creation failed.');
    return { token: signToken(user), user };
  },

  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const normalized = email.toLowerCase().trim();
    const record = await authRepository.findByEmail(normalized);
    if (!record) throw new UnauthorizedError('Invalid email or password.');
    const ok = await verifyPassword(password, record.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid email or password.');
    const { passwordHash: _drop, ...user } = record;
    return { token: signToken(user), user };
  },

  async me(userId: string): Promise<AuthUser | null> {
    return authRepository.findById(userId);
  },
};
