import { ClientOverrideStatus } from './requirementOverride';

export interface IOverride {
  id: string;
  clientId: string;
  safetyProgramRequirementId: string;
  isOverridden: boolean;
  overrideStatus: ClientOverrideStatus;
}
