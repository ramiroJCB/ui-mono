export enum IncidentRegionStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface IIncidentRegion {
  id: string;
  name: string;
  status: IncidentRegionStatus;
  description: string;
  clientId: string;
  isDeleted: boolean;
}
