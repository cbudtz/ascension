import type { AxialHex } from '../../core/hex';

const SQRT3 = Math.sqrt(3);

export function axialToPixel(
  hex: AxialHex,
  size: number,
): { x: number; y: number } {
  return {
    x: size * (SQRT3 * hex.q + (SQRT3 / 2) * hex.r),
    y: size * ((3 / 2) * hex.r),
  };
}

export function pixelToAxial(x: number, y: number, size: number): AxialHex {
  const q = ((SQRT3 / 3) * x - (1 / 3) * y) / size;
  const r = ((2 / 3) * y) / size;
  return axialRound(q, r);
}

/**
 * Pointy-top hex vertex list for Phaser.GameObjects.Polygon.
 * Phaser mis-renders polygons whose points include negatives, so vertices are
 * shifted into the positive quadrant. With the shape's centered origin, the
 * polygon's visual center still sits on the Game Object position.
 */
export function pointyHexPolygonPoints(size: number): number[] {
  const vertices: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    vertices.push({
      x: size * Math.cos(angle),
      y: size * Math.sin(angle),
    });
  }
  const minX = Math.min(...vertices.map((vertex) => vertex.x));
  const minY = Math.min(...vertices.map((vertex) => vertex.y));
  return vertices.flatMap((vertex) => [vertex.x - minX, vertex.y - minY]);
}

function axialRound(q: number, r: number): AxialHex {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  const rs = Math.round(s);

  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr };
}

export const TERRAIN_COLORS: Record<string, number> = {
  neutral: 0x3a4a5c,
  research: 0x2f6fad,
  industry: 0xad4b2f,
  prosperity: 0x3f8f4a,
};

export const BUILDING_COLORS: Record<string, number> = {
  capital: 0xf0d878,
  factory: 0xff7744,
  lab: 0x66ccff,
  farm: 0x88ee66,
  transitTube: 0xb0b8c8,
};
