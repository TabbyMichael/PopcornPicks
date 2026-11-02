// auth repository - SQL access to the users table. No business rules here.
import type { AuthUser } from '@popcornpicks/types';
import { query } from '../../../db/index.js';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

function toAuthUser(row: UserRow): AuthUser {
  return { id: row.id, email: row.email, createdAt: row.created_at };
}

export const authRepository = {
  async create(email: string, passwordHash: string): Promise<AuthUser | null> {
    const result = await query<UserRow>(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, password_hash, created_at',
      [email, passwordHash],
    );
    const row = result.rows[0];
    return row ? toAuthUser(row) : null;
  },

  async findByEmail(email: string): Promise<(AuthUser & { passwordHash: string }) | null> {
    const result = await query<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
    const row = result.rows[0];
    return row ? { ...toAuthUser(row), passwordHash: row.password_hash } : null;
  },

  async findById(id: string): Promise<AuthUser | null> {
    const result = await query<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
    const row = result.rows[0];
    return row ? toAuthUser(row) : null;
  },
};
