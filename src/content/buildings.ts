import type { BuildingDefinition } from './definitions';

export const BUILDINGS: ReadonlyArray<BuildingDefinition> = [
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
];
