export enum IncidentTypeStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface IIncidentType {
  id: string;
  name: string;
  status: IncidentTypeStatus;
  description: string;
  clientId: string;
  isDeleted: boolean;
}
