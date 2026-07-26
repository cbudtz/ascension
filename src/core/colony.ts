import { isConnectedPlacement } from './connectivity';
import { hexKey, type AxialHex } from './hex';
import { computeTrackProduction } from './production';
import {
  err,
  ok,
  type BuildingId,
  type Result,
  type TechnologyId,
  type TerrainId,
  type TrackId,
  type WorkerAllocation,
} from './types';

export type TechnologySpec = {
  readonly id: TechnologyId;
  readonly name: string;
  readonly researchCost: number;
  readonly prerequisites: ReadonlyArray<TechnologyId>;
  readonly researchableInSlice1: boolean;
  readonly unlocksBuilding?: BuildingId;
  readonly unlocksWorkerFocus?: boolean;
  readonly unlocksSystemView?: boolean;
};

export type BuildingSpec = {
  readonly id: BuildingId;
  readonly name: string;
  readonly industryCost: number;
  readonly track: TrackId | null;
  readonly requiredTechnology: TechnologyId | null;
};

export type MapCellSpec = {
  readonly hex: AxialHex;
  readonly terrain: TerrainId;
};

export type ColonyContent = {
  readonly technologies: ReadonlyArray<TechnologySpec>;
  readonly buildings: ReadonlyArray<BuildingSpec>;
  readonly capital: AxialHex;
  readonly cells: ReadonlyArray<MapCellSpec>;
};

export type PlacedBuilding = {
  readonly hex: AxialHex;
  readonly buildingId: BuildingId;
};

export type ConstructionProject = {
  readonly buildingId: BuildingId;
  readonly hex: AxialHex;
  readonly progress: number;
  readonly cost: number;
};

export type ColonyState = {
  readonly day: number;
  readonly workers: WorkerAllocation;
  readonly population: number;
  readonly buildings: ReadonlyArray<PlacedBuilding>;
  readonly completedTechnologies: ReadonlyArray<TechnologyId>;
  readonly researchProgress: Readonly<Record<string, number>>;
  readonly activeTechnologyId: TechnologyId | null;
  readonly bankedResearch: number;
  readonly scienceUnlocked: boolean;
  readonly construction: ConstructionProject | null;
  readonly storedProjects: ReadonlyArray<ConstructionProject>;
  readonly prosperityPool: number;
  readonly systemViewUnlocked: boolean;
  readonly victory: boolean;
};

const PROSPERITY_THRESHOLD = 10;

export function createColony(content: ColonyContent): ColonyState {
  return {
    day: 0,
    workers: { research: 1, industry: 1, prosperity: 1 },
    population: 3,
    buildings: [{ hex: content.capital, buildingId: 'capital' }],
    completedTechnologies: [],
    researchProgress: {},
    activeTechnologyId: null,
    bankedResearch: 0,
    scienceUnlocked: false,
    construction: null,
    storedProjects: [],
    prosperityPool: 0,
    systemViewUnlocked: false,
    victory: false,
  };
}

export function setWorkerAllocation(
  state: ColonyState,
  content: ColonyContent,
  next: WorkerAllocation,
): Result<ColonyState> {
  if (!hasWorkerFocus(state, content)) {
    return err('Worker focus is locked until Colony Planning is researched');
  }
  const total = next.research + next.industry + next.prosperity;
  if (total !== state.population) {
    return err(`Workers must sum to population (${state.population})`);
  }
  if (next.research < 0 || next.industry < 0 || next.prosperity < 0) {
    return err('Worker counts cannot be negative');
  }
  return ok({ ...state, workers: next });
}

export function selectTechnology(
  state: ColonyState,
  content: ColonyContent,
  technologyId: TechnologyId,
): Result<ColonyState> {
  if (!state.scienceUnlocked) {
    return err('Science unlocks after the first round');
  }
  const tech = content.technologies.find((item) => item.id === technologyId);
  if (tech === undefined) {
    return err('Unknown technology');
  }
  if (!tech.researchableInSlice1) {
    return err('Requires a future update');
  }
  if (state.completedTechnologies.includes(technologyId)) {
    return err('Technology already completed');
  }
  if (!prerequisitesMet(state, tech)) {
    return err('Prerequisites not met');
  }

  let next: ColonyState = { ...state, activeTechnologyId: technologyId };
  if (state.bankedResearch > 0) {
    next = applyResearchPoints(next, content, state.bankedResearch);
    next = { ...next, bankedResearch: 0 };
  }
  return ok(next);
}

export function queueConstruction(
  state: ColonyState,
  content: ColonyContent,
  buildingId: BuildingId,
  hex: AxialHex,
): Result<ColonyState> {
  if (buildingId === 'capital') {
    return err('Cannot construct another capital');
  }
  const building = content.buildings.find((item) => item.id === buildingId);
  if (building === undefined) {
    return err('Unknown building');
  }
  if (
    building.requiredTechnology !== null &&
    !state.completedTechnologies.includes(building.requiredTechnology)
  ) {
    return err('Blueprint technology not researched');
  }
  if (hexKey(hex) === hexKey(content.capital)) {
    return err('Capital hex is not buildable');
  }
  const cell = content.cells.find((item) => hexKey(item.hex) === hexKey(hex));
  if (cell === undefined) {
    return err('Hex is outside the homeworld');
  }
  if (state.buildings.some((item) => hexKey(item.hex) === hexKey(hex))) {
    return err('Hex is already occupied');
  }
  if (
    !isConnectedPlacement(
      hex,
      state.buildings.filter((item) => item.buildingId !== 'capital'),
      content.capital,
    )
  ) {
    return err('Building must connect to the capital network');
  }

  const resumed = state.storedProjects.find(
    (project) =>
      project.buildingId === buildingId && hexKey(project.hex) === hexKey(hex),
  );
  const project: ConstructionProject = resumed ?? {
    buildingId,
    hex,
    progress: 0,
    cost: building.industryCost,
  };

  const storedProjects = state.storedProjects.filter(
    (item) =>
      !(item.buildingId === buildingId && hexKey(item.hex) === hexKey(hex)),
  );

  let next: ColonyState = {
    ...state,
    storedProjects,
    construction: project,
  };

  if (state.construction !== null) {
    next = {
      ...next,
      storedProjects: [...storedProjects, state.construction],
    };
  }

  return ok(next);
}

export function endDay(
  state: ColonyState,
  content: ColonyContent,
): Result<ColonyState> {
  const production = summarizeProduction(state, content);
  let next: ColonyState = {
    ...state,
    day: state.day + 1,
    scienceUnlocked: true,
  };

  if (next.activeTechnologyId === null) {
    next = {
      ...next,
      bankedResearch: next.bankedResearch + production.research.total,
    };
  } else {
    next = applyResearchPoints(next, content, production.research.total);
  }

  next = applyConstruction(next, content, production.industry.total);
  next = applyProsperity(next, production.prosperity.total);
  next = {
    ...next,
    victory: hasMilestoneVictory(next),
  };
  return ok(next);
}

export function summarizeProduction(
  state: ColonyState,
  content: ColonyContent,
) {
  return {
    research: trackProduction(state, content, 'research', 'lab'),
    industry: trackProduction(state, content, 'industry', 'factory'),
    prosperity: trackProduction(state, content, 'prosperity', 'farm'),
  };
}

function trackProduction(
  state: ColonyState,
  content: ColonyContent,
  track: TrackId,
  buildingId: BuildingId,
) {
  const buildings = state.buildings.filter(
    (item) => item.buildingId === buildingId,
  );
  const terrainBonuses = buildings.reduce((sum, building) => {
    const cell = content.cells.find(
      (item) => hexKey(item.hex) === hexKey(building.hex),
    );
    if (cell === undefined) {
      return sum;
    }
    if (cell.terrain === track) {
      return sum + 1;
    }
    return sum;
  }, 0);

  return computeTrackProduction({
    workers: state.workers[track],
    buildings: buildings.length,
    terrainBonuses,
  });
}

function applyResearchPoints(
  state: ColonyState,
  content: ColonyContent,
  points: number,
): ColonyState {
  if (state.activeTechnologyId === null || points <= 0) {
    return state;
  }
  const tech = content.technologies.find(
    (item) => item.id === state.activeTechnologyId,
  );
  if (tech === undefined) {
    return state;
  }

  const current = state.researchProgress[tech.id] ?? 0;
  const nextProgress = current + points;
  const researchProgress = {
    ...state.researchProgress,
    [tech.id]: nextProgress,
  };

  if (nextProgress < tech.researchCost) {
    return { ...state, researchProgress };
  }

  let next: ColonyState = {
    ...state,
    researchProgress: { ...researchProgress, [tech.id]: tech.researchCost },
    completedTechnologies: [...state.completedTechnologies, tech.id],
    activeTechnologyId: null,
  };
  if (tech.unlocksSystemView) {
    next = { ...next, systemViewUnlocked: true };
  }
  return next;
}

function applyConstruction(
  state: ColonyState,
  _content: ColonyContent,
  industry: number,
): ColonyState {
  if (state.construction === null || industry <= 0) {
    return state;
  }
  const progress = state.construction.progress + industry;
  if (progress < state.construction.cost) {
    return {
      ...state,
      construction: { ...state.construction, progress },
    };
  }

  return {
    ...state,
    construction: null,
    buildings: [
      ...state.buildings,
      {
        hex: state.construction.hex,
        buildingId: state.construction.buildingId,
      },
    ],
  };
}

function applyProsperity(state: ColonyState, prosperity: number): ColonyState {
  let pool = state.prosperityPool + prosperity;
  let population = state.population;
  let workers = state.workers;

  while (pool >= PROSPERITY_THRESHOLD) {
    pool -= PROSPERITY_THRESHOLD;
    population += 1;
    workers = {
      ...workers,
      prosperity: workers.prosperity + 1,
    };
  }

  return {
    ...state,
    prosperityPool: pool,
    population,
    workers,
  };
}

function hasMilestoneVictory(state: ColonyState): boolean {
  const ids = new Set(state.buildings.map((item) => item.buildingId));
  return ids.has('factory') && ids.has('lab') && ids.has('farm');
}

function hasWorkerFocus(state: ColonyState, content: ColonyContent): boolean {
  return state.completedTechnologies.some((id) => {
    const tech = content.technologies.find((item) => item.id === id);
    return tech?.unlocksWorkerFocus === true;
  });
}

function prerequisitesMet(state: ColonyState, tech: TechnologySpec): boolean {
  return tech.prerequisites.every((id) =>
    state.completedTechnologies.includes(id),
  );
}
