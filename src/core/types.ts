export type TrackId = 'research' | 'industry' | 'prosperity';

export type TerrainId = 'neutral' | 'research' | 'industry' | 'prosperity';

export type BuildingId = 'capital' | 'factory' | 'lab' | 'farm' | 'transitTube';

export type TechnologyId =
  | 'colonyPlanning'
  | 'transitTubes'
  | 'industrialFoundations'
  | 'researchMethods'
  | 'environmentalEncapsulation'
  | 'orbitalCartography'
  | 'xenobiologicalDig'
  | 'starLaneAnatomy'
  | 'massFabrication';

export type WorkerAllocation = {
  readonly research: number;
  readonly industry: number;
  readonly prosperity: number;
};

export type Result<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<T = never>(error: string): Result<T> {
  return { ok: false, error };
}
