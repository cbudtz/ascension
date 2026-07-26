export type AxialHex = {
  readonly q: number;
  readonly r: number;
};

const NEIGHBOR_DELTAS: ReadonlyArray<AxialHex> = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function hexKey(hex: AxialHex): string {
  return `${hex.q},${hex.r}`;
}

export function hexNeighbors(hex: AxialHex): AxialHex[] {
  return NEIGHBOR_DELTAS.map((delta) => ({
    q: hex.q + delta.q,
    r: hex.r + delta.r,
  }));
}

export function parseHexKey(key: string): AxialHex {
  const [qText, rText] = key.split(',');
  if (qText === undefined || rText === undefined) {
    throw new Error(`Invalid hex key: ${key}`);
  }
  return { q: Number(qText), r: Number(rText) };
}
