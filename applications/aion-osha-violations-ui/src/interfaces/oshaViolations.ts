export enum IViolationsType {
  Serious = 'S',
  Willful = 'W',
  Repeat = 'R',
  Other = 'O'
}
export enum CurrentStatus {
  Pending = 'Pending',
  Associated = 'Associated',
  Unassociated = 'Unassociated',
  Other = 'NoAutomaticMatch'
}

export interface IOshaViolations {
  id: string;
  importedDateUtc: string;
  oshaCompanyName: string;
  citationId: string;
  activityNumber: number;
  violationType: IViolationsType;
  openedDate: string;
  closedDate: string;
  naicsCode: number;
  naicsDescription: string;
  address: string;
  city: string;
  state: string;
  zip: number;
  formattedAddress: string;
  createdBy: string;
  updatedBy: string;
  createdDateUtc: string;
  updatedDateUtc: string;
  status: CurrentStatus; // Pending | Associated | Unassociated | NoAutomaticMatch
  matchType: string;
  associatedCompanyName?: string;
  associatedCompanyNumber?: number; //SSQID
  associatedMatchPercentage?: number;
  associatedCompanyId?: string;
  associatedOrganizationViolationId?: string;
}
