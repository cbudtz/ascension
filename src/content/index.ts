import { BUILDINGS } from './buildings';
import type { GameContent } from './definitions';
import { HOMEWORLD } from './homeworld';
import { TECHNOLOGIES } from './technologies';

export { toColonyContent } from './toColonyContent';
export type { GameContent } from './definitions';

export function createSlice1Content(): GameContent {
  return {
    technologies: TECHNOLOGIES,
    buildings: BUILDINGS,
    homeworld: HOMEWORLD,
  };
}
