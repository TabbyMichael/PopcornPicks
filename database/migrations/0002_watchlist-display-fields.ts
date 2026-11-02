import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

// Persist the display fields the watchlist cards need across devices.
export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumns('watchlist_items', {
    vote_average: { type: 'double precision', notNull: true, default: 0 },
    release_date: { type: 'text', notNull: true, default: '' },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns('watchlist_items', ['vote_average', 'release_date']);
}
