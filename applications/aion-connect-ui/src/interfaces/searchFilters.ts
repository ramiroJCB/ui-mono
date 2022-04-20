import { PredictiveRanking } from './searchResult';

export interface ISearchFilters {
  employeeCounts: number[];
  naicsCodes: string[];
  tags: string[];
  businessUnits: string[];
  predictiveRankings: (PredictiveRanking | null)[];
}
