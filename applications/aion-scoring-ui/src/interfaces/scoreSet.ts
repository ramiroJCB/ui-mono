export interface IScoreSet {
  id: string;
  name: string;
  totalPointsAvailable: number;
  serviceRegionId: string;
  organizationId: string;
  isActive: boolean;
}

export interface IAddScoreSet {
  name: string;
  serviceRegionId: string;
  organizationId: string;
  isActive: boolean;
}
