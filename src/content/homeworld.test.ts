import { describe, expect, it } from 'vitest';

import { hexKey } from '../core/hex';
import { HOMEWORLD } from './homeworld';

describe('HOMEWORLD', () => {
  it('has a capital at the origin and about two rings of hexes', () => {
    expect(HOMEWORLD.capital).toEqual({ q: 0, r: 0 });
    expect(HOMEWORLD.cells.length).toBe(37);
    const keys = new Set(HOMEWORLD.cells.map((cell) => hexKey(cell)));
    expect(keys.has('0,0')).toBe(true);
    expect(keys.has('2,0')).toBe(true);
  });

  it('places some bonus hexes two steps from the capital', () => {
    const distant = HOMEWORLD.cells.find(
      (cell) => cell.q === 2 && cell.r === 0,
    );
    expect(distant?.terrain).toBe('industry');
  });
});
