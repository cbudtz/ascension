import type { TerrainId } from '../core/types';
import type { HomeworldDefinition, MapCellDefinition } from './definitions';

function ring(radius: number): MapCellDefinition[] {
  if (radius === 0) {
    return [{ q: 0, r: 0, terrain: 'neutral' }];
  }

  const cells: MapCellDefinition[] = [];
  let q = radius;
  let r = 0;
  const directions = [
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
    { q: 1, r: 0 },
    { q: 1, r: -1 },
  ];

  for (const dir of directions) {
    for (let step = 0; step < radius; step += 1) {
      cells.push({ q, r, terrain: terrainFor(q, r) });
      q += dir.q;
      r += dir.r;
    }
  }

  return cells;
}

function terrainFor(q: number, r: number): TerrainId {
  const hash = ((q * 73856093) ^ (r * 19349663)) >>> 0;
  const bucket = hash % 4;
  if (bucket === 0) return 'research';
  if (bucket === 1) return 'industry';
  if (bucket === 2) return 'prosperity';
  return 'neutral';
}

function buildDisk(radius: number): MapCellDefinition[] {
  const cells: MapCellDefinition[] = [];
  for (let r = 0; r <= radius; r += 1) {
    cells.push(...ring(r));
  }
  // Force a few distant bonus tiles so tubes matter.
  const overrides: Record<string, TerrainId> = {
    '2,0': 'industry',
    '0,2': 'research',
    '-2,2': 'prosperity',
    '2,-2': 'industry',
  };
  return cells.map((cell) => {
    const key = `${cell.q},${cell.r}`;
    const terrain = overrides[key];
    if (terrain === undefined) {
      return cell;
    }
    return { ...cell, terrain };
  });
}

export const HOMEWORLD: HomeworldDefinition = {
  capital: { q: 0, r: 0 },
  cells: buildDisk(3),
};
