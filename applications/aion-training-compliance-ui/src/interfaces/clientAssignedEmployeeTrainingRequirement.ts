import { ComplianceLevel } from './complianceLevel';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';

export interface IClientAssignedEmployeeTrainingRequirement {
  employeeId: string;
  trainingRequirementId: string;
  clientId: string;
  trainingRequirementName: string;
  status: ComplianceLevel;
  completionDateUtc: string | null;
  completionDateUpdatedDateUtc: string | null;
  isDeleted: true;
  trainingRequirement: ITrainingRequirement;
  employeeTrainingRequirementId: string;
}
