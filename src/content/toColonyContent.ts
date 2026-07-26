import type { ColonyContent } from '../core/colony';
import type { GameContent } from './definitions';

export function toColonyContent(content: GameContent): ColonyContent {
  return {
    technologies: content.technologies.map((technology) => ({
      id: technology.id,
      name: technology.name,
      researchCost: technology.researchCost,
      prerequisites: technology.prerequisites,
      researchableInSlice1: technology.researchableInSlice1,
      unlocksBuilding: technology.unlocksBuilding,
      unlocksWorkerFocus: technology.unlocksWorkerFocus,
      unlocksSystemView: technology.unlocksSystemView,
    })),
    buildings: content.buildings.map((building) => ({
      id: building.id,
      name: building.name,
      industryCost: building.industryCost,
      track: building.track,
      requiredTechnology: building.requiredTechnology,
    })),
    capital: content.homeworld.capital,
    cells: content.homeworld.cells.map((cell) => ({
      hex: { q: cell.q, r: cell.r },
      terrain: cell.terrain,
    })),
  };
}
