export type TrackProductionInput = {
  readonly workers: number;
  readonly buildings: number;
  readonly terrainBonuses: number;
};

export type TrackProduction = {
  readonly capital: number;
  readonly workerOutput: number;
  readonly buildingOutput: number;
  readonly terrainOutput: number;
  readonly total: number;
};

/**
 * Decision 010 matching rules for one R/I/P track.
 * Capital always adds +1 baseline. Capital also provides one free matched
 * worker slot when workers exceed buildings.
 */
export function computeTrackProduction(
  input: TrackProductionInput,
): TrackProduction {
  const workers = Math.max(0, input.workers);
  const buildings = Math.max(0, input.buildings);
  const terrainOutput = Math.max(0, input.terrainBonuses);

  const matchedBuildings = Math.min(workers, buildings);
  const workersAfterBuildings = workers - matchedBuildings;

  const capitalMatchedWorker = workersAfterBuildings > 0 ? 1 : 0;
  const excessWorkers = Math.max(
    0,
    workersAfterBuildings - capitalMatchedWorker,
  );

  const workerOutput =
    matchedBuildings + capitalMatchedWorker + excessWorkers * 0.5;
  const excessBuildings = buildings - matchedBuildings;
  const buildingOutput = matchedBuildings + excessBuildings * 0.5;
  const capital = 1;

  return {
    capital,
    workerOutput,
    buildingOutput,
    terrainOutput,
    total: capital + workerOutput + buildingOutput + terrainOutput,
  };
}
