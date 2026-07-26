import { describe, expect, it } from 'vitest';

import {
  createColony,
  endDay,
  queueConstruction,
  selectTechnology,
  setWorkerAllocation,
  summarizeProduction,
  type ColonyContent,
} from './colony';
import type { TechnologyId } from './types';

const content: ColonyContent = {
  capital: { q: 0, r: 0 },
  cells: [
    { hex: { q: 0, r: 0 }, terrain: 'neutral' },
    { hex: { q: 1, r: 0 }, terrain: 'neutral' },
    { hex: { q: 2, r: 0 }, terrain: 'industry' },
    { hex: { q: 0, r: 1 }, terrain: 'research' },
    { hex: { q: -1, r: 1 }, terrain: 'prosperity' },
  ],
  buildings: [
    {
      id: 'capital',
      name: 'Capital',
      industryCost: 0,
      track: null,
      requiredTechnology: null,
    },
    {
      id: 'factory',
      name: 'Factory',
      industryCost: 5,
      track: 'industry',
      requiredTechnology: 'industrialFoundations',
    },
    {
      id: 'lab',
      name: 'Lab',
      industryCost: 5,
      track: 'research',
      requiredTechnology: 'researchMethods',
    },
    {
      id: 'farm',
      name: 'Farm',
      industryCost: 5,
      track: 'prosperity',
      requiredTechnology: 'environmentalEncapsulation',
    },
    {
      id: 'transitTube',
      name: 'Transit Tube',
      industryCost: 2,
      track: null,
      requiredTechnology: 'transitTubes',
    },
  ],
  technologies: [
    {
      id: 'colonyPlanning',
      name: 'Colony Planning',
      researchCost: 3,
      prerequisites: [],
      researchableInSlice1: true,
      unlocksWorkerFocus: true,
    },
    {
      id: 'transitTubes',
      name: 'Transit Tubes',
      researchCost: 3,
      prerequisites: [],
      researchableInSlice1: true,
      unlocksBuilding: 'transitTube',
    },
    {
      id: 'industrialFoundations',
      name: 'Industrial Foundations',
      researchCost: 5,
      prerequisites: [],
      researchableInSlice1: true,
      unlocksBuilding: 'factory',
    },
    {
      id: 'researchMethods',
      name: 'Research Methods',
      researchCost: 5,
      prerequisites: [],
      researchableInSlice1: true,
      unlocksBuilding: 'lab',
    },
    {
      id: 'environmentalEncapsulation',
      name: 'Environmental Encapsulation',
      researchCost: 5,
      prerequisites: [],
      researchableInSlice1: true,
      unlocksBuilding: 'farm',
    },
    {
      id: 'orbitalCartography',
      name: 'Orbital Cartography',
      researchCost: 7,
      prerequisites: ['researchMethods'],
      researchableInSlice1: true,
      unlocksSystemView: true,
    },
    {
      id: 'xenobiologicalDig',
      name: 'Xenobiological Dig',
      researchCost: 12,
      prerequisites: ['researchMethods'],
      researchableInSlice1: false,
    },
  ],
};

describe('colony simulation', () => {
  it('starts with three balanced workers and no active technology', () => {
    const colony = createColony(content);
    expect(colony.population).toBe(3);
    expect(colony.workers).toEqual({
      research: 1,
      industry: 1,
      prosperity: 1,
    });
    expect(colony.activeTechnologyId).toBeNull();
    expect(colony.scienceUnlocked).toBe(false);
  });

  it('rejects worker reallocation before Colony Planning', () => {
    const colony = createColony(content);
    const result = setWorkerAllocation(colony, content, {
      research: 0,
      industry: 3,
      prosperity: 0,
    });
    expect(result.ok).toBe(false);
  });

  it('banks research on the first day and unlocks science', () => {
    const colony = createColony(content);
    const production = summarizeProduction(colony, content);
    const ended = endDay(colony, content);
    expect(ended.ok).toBe(true);
    if (!ended.ok) return;
    expect(ended.value.day).toBe(1);
    expect(ended.value.scienceUnlocked).toBe(true);
    expect(ended.value.bankedResearch).toBe(production.research.total);
  });

  it('applies banked research when a technology is selected', () => {
    let colony = createColony(content);
    colony = unwrap(endDay(colony, content));
    colony = unwrap(selectTechnology(colony, content, 'colonyPlanning'));
    expect(colony.bankedResearch).toBe(0);
    expect(colony.researchProgress.colonyPlanning).toBeGreaterThan(0);
  });

  it('unlocks worker focus after Colony Planning completes', () => {
    let colony = createColony(content);
    colony = researchToCompletion(colony, 'colonyPlanning');
    expect(colony.completedTechnologies).toContain('colonyPlanning');
    colony = unwrap(
      setWorkerAllocation(colony, content, {
        research: 0,
        industry: 3,
        prosperity: 0,
      }),
    );
    expect(colony.workers.industry).toBe(3);
  });

  it('builds a factory in two focused industry turns', () => {
    let colony = createColony(content);
    colony = researchToCompletion(colony, 'colonyPlanning');
    colony = researchToCompletion(colony, 'industrialFoundations');
    colony = unwrap(
      setWorkerAllocation(colony, content, {
        research: 0,
        industry: 3,
        prosperity: 0,
      }),
    );
    colony = unwrap(
      queueConstruction(colony, content, 'factory', { q: 1, r: 0 }),
    );
    colony = unwrap(endDay(colony, content));
    expect(colony.construction?.progress).toBe(3);
    colony = unwrap(endDay(colony, content));
    expect(colony.construction).toBeNull();
    expect(
      colony.buildings.some((building) => building.buildingId === 'factory'),
    ).toBe(true);
  });

  it('rejects disconnected construction and allows bridging with a tube', () => {
    let colony = createColony(content);
    colony = researchToCompletion(colony, 'colonyPlanning');
    colony = researchToCompletion(colony, 'transitTubes');
    colony = researchToCompletion(colony, 'industrialFoundations');
    colony = unwrap(
      setWorkerAllocation(colony, content, {
        research: 0,
        industry: 3,
        prosperity: 0,
      }),
    );

    const blocked = queueConstruction(colony, content, 'factory', {
      q: 2,
      r: 0,
    });
    expect(blocked.ok).toBe(false);

    colony = unwrap(
      queueConstruction(colony, content, 'transitTube', { q: 1, r: 0 }),
    );
    colony = unwrap(endDay(colony, content));
    expect(
      colony.buildings.some(
        (building) => building.buildingId === 'transitTube',
      ),
    ).toBe(true);

    colony = unwrap(
      queueConstruction(colony, content, 'factory', { q: 2, r: 0 }),
    );
    expect(colony.construction?.buildingId).toBe('factory');
  });

  it('rejects locked technologies with future-update messaging', () => {
    let colony = createColony(content);
    colony = researchToCompletion(colony, 'researchMethods');
    const result = selectTechnology(colony, content, 'xenobiologicalDig');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/future update/i);
  });

  it('grows population when prosperity reaches the threshold', () => {
    let colony = createColony(content);
    colony = researchToCompletion(colony, 'colonyPlanning');
    colony = researchToCompletion(colony, 'environmentalEncapsulation');
    colony = unwrap(
      setWorkerAllocation(colony, content, {
        research: 0,
        industry: 3,
        prosperity: 0,
      }),
    );
    colony = unwrap(queueConstruction(colony, content, 'farm', { q: 1, r: 0 }));
    colony = unwrap(endDay(colony, content));
    colony = unwrap(endDay(colony, content));
    expect(
      colony.buildings.some((building) => building.buildingId === 'farm'),
    ).toBe(true);

    colony = unwrap(
      setWorkerAllocation(colony, content, {
        research: 0,
        industry: 0,
        prosperity: colony.population,
      }),
    );
    const before = colony.population;
    for (let turn = 0; turn < 20 && colony.population === before; turn += 1) {
      colony = unwrap(endDay(colony, content));
    }
    expect(colony.population).toBeGreaterThan(before);
  });
});

function unwrap<T>(
  result: { ok: true; value: T } | { ok: false; error: string },
): T {
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.value;
}

function researchToCompletion(
  start: ReturnType<typeof createColony>,
  technologyId: TechnologyId,
) {
  let colony = start;
  if (!colony.scienceUnlocked) {
    colony = unwrap(endDay(colony, content));
  }

  for (let turn = 0; turn < 30; turn += 1) {
    if (colony.completedTechnologies.includes(technologyId)) {
      return colony;
    }
    if (colony.completedTechnologies.includes('colonyPlanning')) {
      const focused = setWorkerAllocation(colony, content, {
        research: colony.population,
        industry: 0,
        prosperity: 0,
      });
      if (focused.ok) {
        colony = focused.value;
      }
    }
    if (colony.activeTechnologyId !== technologyId) {
      colony = unwrap(selectTechnology(colony, content, technologyId));
    }
    colony = unwrap(endDay(colony, content));
  }
  throw new Error(`Failed to finish ${technologyId}`);
}
