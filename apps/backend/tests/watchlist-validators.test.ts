// watchlists validators - body/route-param parsing in front of the CRUD repo.
import { describe, expect, it } from 'vitest';

import { ValidationError } from '../src/common/index.js';
import {
  parseTmdbId,
  parseWatchlistEntry,
} from '../src/modules/watchlists/validators/index.js';

describe('parseWatchlistEntry', () => {
  it('accepts a valid movie entry and defaults optional fields', () => {
    const entry = parseWatchlistEntry({ tmdbId: 550, kind: 'movie', title: ' Fight Club ' });
    expect(entry).toEqual({
      tmdbId: 550,
      kind: 'movie',
      title: 'Fight Club',
      posterPath: null,
      voteAverage: 0,
      releaseDate: '',
    });
  });

  it('carries through the optional display fields when present', () => {
    const entry = parseWatchlistEntry({
      tmdbId: 1409,
      kind: 'series',
      title: 'Oppenheimer',
      posterPath: '/abc.jpg',
      voteAverage: 8.1,
      releaseDate: '2023-07-21',
    });
    expect(entry.posterPath).toBe('/abc.jpg');
    expect(entry.voteAverage).toBe(8.1);
    expect(entry.releaseDate).toBe('2023-07-21');
  });

  it('rejects a non-positive / non-integer tmdbId', () => {
    expect(() => parseWatchlistEntry({ tmdbId: 0, kind: 'movie', title: 'x' })).toThrow(ValidationError);
    expect(() => parseWatchlistEntry({ tmdbId: 1.5, kind: 'movie', title: 'x' })).toThrow(ValidationError);
    expect(() => parseWatchlistEntry({ kind: 'movie', title: 'x' })).toThrow(ValidationError);
  });

  it('rejects an unknown kind', () => {
    expect(() => parseWatchlistEntry({ tmdbId: 1, kind: 'cartoon', title: 'x' })).toThrow(ValidationError);
  });

  it('rejects a blank or missing title', () => {
    expect(() => parseWatchlistEntry({ tmdbId: 1, kind: 'movie', title: '   ' })).toThrow(ValidationError);
    expect(() => parseWatchlistEntry({ tmdbId: 1, kind: 'movie' })).toThrow(ValidationError);
  });
});

describe('parseTmdbId', () => {
  it('returns the id for a valid positive integer string', () => {
    expect(parseTmdbId('550')).toBe(550);
  });

  it('throws ValidationError for invalid ids', () => {
    expect(() => parseTmdbId('abc')).toThrow(ValidationError);
    expect(() => parseTmdbId('-1')).toThrow(ValidationError);
    expect(() => parseTmdbId('')).toThrow(ValidationError);
  });
});
