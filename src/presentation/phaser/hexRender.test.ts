import { describe, expect, it } from 'vitest';

import { pointyHexPolygonPoints } from './hexRender';

describe('pointyHexPolygonPoints', () => {
  it('keeps all vertices non-negative for Phaser polygon rendering', () => {
    const points = pointyHexPolygonPoints(28);
    expect(points).toHaveLength(12);
    for (const value of points) {
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });

  it('spans a centered bounding box around the hex size', () => {
    const size = 28;
    const points = pointyHexPolygonPoints(size);
    const xs = points.filter((_, index) => index % 2 === 0);
    const ys = points.filter((_, index) => index % 2 === 1);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    expect(width).toBeCloseTo(size * Math.sqrt(3), 5);
    expect(height).toBeCloseTo(size * 2, 5);
  });
});
