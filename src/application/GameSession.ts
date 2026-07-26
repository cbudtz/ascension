import type { ColonyContent } from '../core/colony';
import {
  createColony,
  endDay,
  queueConstruction,
  selectTechnology,
  setWorkerAllocation,
  summarizeProduction,
  type ColonyState,
} from '../core/colony';
import type { AxialHex } from '../core/hex';
import type {
  BuildingId,
  Result,
  TechnologyId,
  WorkerAllocation,
} from '../core/types';

export type GameSnapshot = {
  readonly day: number;
  readonly workers: WorkerAllocation;
  readonly population: number;
  readonly prosperityPool: number;
  readonly scienceUnlocked: boolean;
  readonly systemViewUnlocked: boolean;
  readonly victory: boolean;
  readonly activeTechnologyId: TechnologyId | null;
  readonly bankedResearch: number;
  readonly completedTechnologies: ReadonlyArray<TechnologyId>;
  readonly researchProgress: Readonly<Record<string, number>>;
  readonly construction: ColonyState['construction'];
  readonly buildings: ColonyState['buildings'];
  readonly production: ReturnType<typeof summarizeProduction>;
  readonly canChangeWorkers: boolean;
};

export class GameSession {
  private state: ColonyState;

  public constructor(private readonly content: ColonyContent) {
    this.state = createColony(content);
  }

  public snapshot(): GameSnapshot {
    return {
      day: this.state.day,
      workers: this.state.workers,
      population: this.state.population,
      prosperityPool: this.state.prosperityPool,
      scienceUnlocked: this.state.scienceUnlocked,
      systemViewUnlocked: this.state.systemViewUnlocked,
      victory: this.state.victory,
      activeTechnologyId: this.state.activeTechnologyId,
      bankedResearch: this.state.bankedResearch,
      completedTechnologies: this.state.completedTechnologies,
      researchProgress: this.state.researchProgress,
      construction: this.state.construction,
      buildings: this.state.buildings,
      production: summarizeProduction(this.state, this.content),
      canChangeWorkers:
        this.state.completedTechnologies.includes('colonyPlanning'),
    };
  }

  public getContent(): ColonyContent {
    return this.content;
  }

  public endTurn(): Result<GameSnapshot> {
    return this.apply(endDay(this.state, this.content));
  }

  public setWorkers(next: WorkerAllocation): Result<GameSnapshot> {
    return this.apply(setWorkerAllocation(this.state, this.content, next));
  }

  public selectTech(technologyId: TechnologyId): Result<GameSnapshot> {
    return this.apply(selectTechnology(this.state, this.content, technologyId));
  }

  public queueBuild(
    buildingId: BuildingId,
    hex: AxialHex,
  ): Result<GameSnapshot> {
    return this.apply(
      queueConstruction(this.state, this.content, buildingId, hex),
    );
  }

  private apply(result: Result<ColonyState>): Result<GameSnapshot> {
    if (!result.ok) {
      return result;
    }
    this.state = result.value;
    return { ok: true, value: this.snapshot() };
  }
}
