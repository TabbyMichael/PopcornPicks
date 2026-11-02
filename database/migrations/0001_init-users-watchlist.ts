import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

// Initial schema: auth users + persisted watchlist (ADR-0002: PostgreSQL-first).
export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    email: { type: 'text', notNull: true, unique: true },
    password_hash: { type: 'text', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('watchlist_items', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    tmdb_id: { type: 'integer', notNull: true },
    kind: { type: 'text', notNull: true },
    title: { type: 'text', notNull: true },
    poster_path: { type: 'text' },
    added_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.addConstraint('watchlist_items', 'watchlist_unique_title', {
    unique: ['user_id', 'tmdb_id', 'kind'],
  });

  pgm.createIndex('watchlist_items', 'user_id');

  pgm.sql('ALTER TABLE watchlist_items ADD CONSTRAINT watchlist_kind_check CHECK (kind IN (\'movie\', \'series\'))');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('watchlist_items');
  pgm.dropTable('users');
}
