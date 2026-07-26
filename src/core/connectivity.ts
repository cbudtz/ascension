import { hexKey, hexNeighbors, type AxialHex } from './hex';
import type { BuildingId } from './types';

export type OccupiedHex = {
  readonly hex: AxialHex;
  readonly buildingId: BuildingId;
};

export function isConnectedPlacement(
  candidate: AxialHex,
  occupied: ReadonlyArray<OccupiedHex>,
  capital: AxialHex,
): boolean {
  const connected = collectConnectedKeys(occupied, capital);
  return hexNeighbors(candidate).some((neighbor) =>
    connected.has(hexKey(neighbor)),
  );
}

export function collectConnectedKeys(
  occupied: ReadonlyArray<OccupiedHex>,
  capital: AxialHex,
): Set<string> {
  const byKey = new Map<string, BuildingId>();
  for (const cell of occupied) {
    byKey.set(hexKey(cell.hex), cell.buildingId);
  }

  const capitalKey = hexKey(capital);
  const visited = new Set<string>([capitalKey]);
  const queue = [capitalKey];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined) {
      break;
    }
    const [qText, rText] = current.split(',');
    const hex = { q: Number(qText), r: Number(rText) };
    for (const neighbor of hexNeighbors(hex)) {
      const key = hexKey(neighbor);
      if (visited.has(key)) {
        continue;
      }
      if (!byKey.has(key) && key !== capitalKey) {
        continue;
      }
      visited.add(key);
      queue.push(key);
    }
  }

  return visited;
}
