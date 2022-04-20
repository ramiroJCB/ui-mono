export interface IViolationsFilters {
  state?: { label: string; value: string };
  naics?: string;
  keyword?: string;
  activity?: string;
  automaticMatches?: string;
}
