import { describe, expect, it } from 'vitest';

import { hexKey, hexNeighbors, type AxialHex } from './hex';

describe('axial hex helpers', () => {
  it('builds stable keys', () => {
    expect(hexKey({ q: 0, r: 0 })).toBe('0,0');
    expect(hexKey({ q: -2, r: 1 })).toBe('-2,1');
  });

  it('returns six neighbors for a hex', () => {
    const origin: AxialHex = { q: 0, r: 0 };
    const keys = hexNeighbors(origin).map(hexKey).sort();
    expect(keys).toEqual(['-1,0', '-1,1', '0,-1', '0,1', '1,-1', '1,0']);
  });
});
