import { IClientRequirement } from './requirement';

export enum ClientOverrideStatus {
  None = 'None',
  Approved = 'Approved',
  Granted = 'Granted',
  Denied = 'Denied',
  Requested = 'Requested',
  Removed = 'Removed'
}

export interface IClientRequirementOverride {
  id: string;
  clientName: string;
  safetyProgramRequirementOverrideRequestId: string;
  safetyProgramRequirementClientId: string;
  status: ClientOverrideStatus;
  comment: string;
  clientId: string;
  contractorCompanyNumber: string | null;
  contractorName: string;
  safetyProgramName: string;
  requestComment: string;
  requestUpdatedDateUtc: string;
  requestUpdatedBy: string;
  requirementClient: IClientRequirement;
}

export interface IRequirementOverride {
  id: string;
  safetyProgramRequirementId: string;
  comment: string;
  isActive: boolean;
  contractorCompanyNumber: number;
  contractorName: string;
  safetyProgramName: string;
  contractorId: string;
  clientOverrides: IClientRequirementOverride[];
  createdBy: string;
  createdDateUtc: string;
}
