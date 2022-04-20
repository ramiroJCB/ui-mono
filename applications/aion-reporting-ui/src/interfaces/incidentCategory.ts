export enum IncidentCategoryStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface IIncidentCategory {
  id: string;
  name: string;
  status: IncidentCategoryStatus;
  description: string;
  clientId: string;
  isDeleted: boolean;
}
