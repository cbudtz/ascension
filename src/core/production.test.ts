import { describe, expect, it } from 'vitest';

import { computeTrackProduction } from './production';

describe('computeTrackProduction', () => {
  it('gives capital baseline and one free matched worker with no buildings', () => {
    const result = computeTrackProduction({
      workers: 1,
      buildings: 0,
      terrainBonuses: 0,
    });
    expect(result).toEqual({
      capital: 1,
      workerOutput: 1,
      buildingOutput: 0,
      terrainOutput: 0,
      total: 2,
    });
  });

  it('treats extra workers without buildings as half-efficiency', () => {
    const result = computeTrackProduction({
      workers: 3,
      buildings: 0,
      terrainBonuses: 0,
    });
    expect(result.workerOutput).toBe(2);
    expect(result.total).toBe(3);
  });

  it('matches workers and buildings at full rate', () => {
    const result = computeTrackProduction({
      workers: 1,
      buildings: 1,
      terrainBonuses: 0,
    });
    expect(result.workerOutput).toBe(1);
    expect(result.buildingOutput).toBe(1);
    expect(result.total).toBe(3);
  });

  it('applies capital-matched worker when workers exceed buildings by one or more', () => {
    const result = computeTrackProduction({
      workers: 2,
      buildings: 1,
      terrainBonuses: 0,
    });
    expect(result.workerOutput).toBe(2);
    expect(result.buildingOutput).toBe(1);
    expect(result.total).toBe(4);
  });

  it('halves excess buildings', () => {
    const result = computeTrackProduction({
      workers: 1,
      buildings: 2,
      terrainBonuses: 0,
    });
    expect(result.workerOutput).toBe(1);
    expect(result.buildingOutput).toBe(1.5);
    expect(result.total).toBe(3.5);
  });

  it('adds terrain bonuses only as provided', () => {
    const result = computeTrackProduction({
      workers: 1,
      buildings: 1,
      terrainBonuses: 1,
    });
    expect(result.terrainOutput).toBe(1);
    expect(result.total).toBe(4);
  });

  it('supports focused industry without factory at 3 total', () => {
    const result = computeTrackProduction({
      workers: 3,
      buildings: 0,
      terrainBonuses: 0,
    });
    expect(result.total).toBe(3);
  });
});
