export enum IncidentWorkGroupStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface IIncidentWorkGroup {
  id: string;
  name: string;
  status: IncidentWorkGroupStatus;
  description: string;
  clientId: string;
  isDeleted: boolean;
}
