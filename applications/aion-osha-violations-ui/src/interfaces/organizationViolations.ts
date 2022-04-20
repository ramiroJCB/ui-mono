import { IViolationsType } from './oshaViolations';
import { CurrentStatus } from './oshaViolations';
export interface IOrganizationViolation {
  id: string;
  name: string;
  primaryAddress: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  createdBy: string;
  updatedBy: string;
  createdDateUtc: string;
  updatedDateUtc: string;
  naicsCodeId: string;
  companyNumber: number;
  formattedAddress: string;
}
export interface IOrganizationViolations {
  id: string;
  state: string;
  createdBy: string;
  updatedBy: string;
  citationId: string;
  closedDate: string;
  openedDate: string;
  companyName: string;
  oshaNaicsCode: string;
  companyNumber: number;
  organizationId: number;
  updatedDateUtc: string;
  createdDateUtc: string;
  activityNumber: number;
  oshaViolationId: string;
  importedDateUtc: string;
  matchPercentage: number;
  oshaCompanyName: string;
  matchStatus: CurrentStatus;
  oshaNaicsDescription: string;
  violationType: IViolationsType;
  formattedAddress: string;
}
