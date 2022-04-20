export enum IncidentRootCauseStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface IIncidentRootCause {
  id: string;
  name: string;
  status: IncidentRootCauseStatus;
  description: string;
  clientId: string;
  isDeleted: boolean;
}
