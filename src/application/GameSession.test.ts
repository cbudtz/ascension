import { describe, expect, it } from 'vitest';

import type { ColonyContent } from '../core/colony';
import { GameSession } from './GameSession';

const content: ColonyContent = {
  capital: { q: 0, r: 0 },
  cells: [
    { hex: { q: 0, r: 0 }, terrain: 'neutral' },
    { hex: { q: 1, r: 0 }, terrain: 'neutral' },
  ],
  buildings: [
    {
      id: 'capital',
      name: 'Capital',
      industryCost: 0,
      track: null,
      requiredTechnology: null,
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
  ],
};

describe('GameSession', () => {
  it('exposes a snapshot and ends the first turn', () => {
    const session = new GameSession(content);
    const before = session.snapshot();
    expect(before.day).toBe(0);
    expect(before.scienceUnlocked).toBe(false);

    const ended = session.endTurn();
    expect(ended.ok).toBe(true);
    if (!ended.ok) return;
    expect(ended.value.day).toBe(1);
    expect(ended.value.scienceUnlocked).toBe(true);
    expect(ended.value.bankedResearch).toBeGreaterThan(0);
  });
});
