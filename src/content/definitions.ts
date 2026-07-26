import type {
  BuildingId,
  TechnologyId,
  TerrainId,
  TrackId,
} from '../core/types';
import type { AxialHex } from '../core/hex';

export type TechnologyDefinition = {
  readonly id: TechnologyId;
  readonly name: string;
  readonly researchCost: number;
  readonly prerequisites: ReadonlyArray<TechnologyId>;
  readonly researchableInSlice1: boolean;
  readonly unlocksBuilding?: BuildingId;
  readonly unlocksWorkerFocus?: boolean;
  readonly unlocksSystemView?: boolean;
};

export type BuildingDefinition = {
  readonly id: BuildingId;
  readonly name: string;
  readonly industryCost: number;
  readonly track: TrackId | null;
  readonly requiredTechnology: TechnologyId | null;
};

export type MapCellDefinition = {
  readonly q: number;
  readonly r: number;
  readonly terrain: TerrainId;
};

export type HomeworldDefinition = {
  readonly capital: AxialHex;
  readonly cells: ReadonlyArray<MapCellDefinition>;
};

export type GameContent = {
  readonly technologies: ReadonlyArray<TechnologyDefinition>;
  readonly buildings: ReadonlyArray<BuildingDefinition>;
  readonly homeworld: HomeworldDefinition;
};
