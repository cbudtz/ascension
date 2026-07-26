import { describe, expect, it } from 'vitest';

import { isConnectedPlacement } from './connectivity';

describe('isConnectedPlacement', () => {
  const capital = { q: 0, r: 0 };

  it('allows building adjacent to the capital', () => {
    expect(isConnectedPlacement({ q: 1, r: 0 }, [], capital)).toBe(true);
  });

  it('rejects a hex two steps away with no bridge', () => {
    expect(isConnectedPlacement({ q: 2, r: 0 }, [], capital)).toBe(false);
  });

  it('allows a distant hex after a completed tube bridges the path', () => {
    expect(
      isConnectedPlacement(
        { q: 2, r: 0 },
        [{ hex: { q: 1, r: 0 }, buildingId: 'transitTube' }],
        capital,
      ),
    ).toBe(true);
  });
});
