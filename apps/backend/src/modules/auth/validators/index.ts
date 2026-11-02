// auth validators - input checks for credentials, kept out of the controller.
import { ValidationError } from '../../../common/index.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

/** Normalizes + validates a login/register payload; throws ValidationError. */
export function parseCredentials(raw: unknown): { email: string; password: string } {
  const body = (raw ?? {}) as { email?: unknown; password?: unknown };
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!EMAIL_RE.test(email)) {
    throw new ValidationError('A valid email is required.');
  }
  if (password.length < MIN_PASSWORD) {
    throw new ValidationError(`Password must be at least ${MIN_PASSWORD} characters.`);
  }
  return { email, password };
}
