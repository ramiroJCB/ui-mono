export interface ISearchResult {
  id: string;
  name: string;
  description: string | null;
  connectionStatus: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  latitude: number;
  longitude: number;
  distance: number;
  naicsCode: string | null;
  services: string[] | null;
  employeeCount: number;
  tags: string[] | null;
  businessUnits: string[] | null;
  predictiveRanking: PredictiveRanking | null;
  tradeName: string | null;
  profilePercentComplete: number;
}

export interface ISearchResultWithLogo extends ISearchResult {
  logo?: Blob;
  isFetching?: boolean;
  hasFetched?: boolean;
}

export enum PredictiveRanking {
  Standard = 'Standard',
  Elevated = 'Elevated',
  High = 'High'
}
