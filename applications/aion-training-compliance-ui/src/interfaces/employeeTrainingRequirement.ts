import { ComplianceLevel } from './complianceLevel';
import { IDocumentWithStatus } from './documentWithStatus';
import { IEmployee } from './employee';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';

export interface IEmployeeTrainingRequirement {
  id: string;
  employeeId: string;
  contractorId: string;
  trainingRequirementId: string;
  clientId: string;
  status: ComplianceLevel;
  completionDateUtc: string | null;
  completionDateUpdatedDateUtc: string | null;
  isDeleted: boolean;
  trainingRequirement: ITrainingRequirement;
  metaData: IDocumentWithStatus[];
  employee: IEmployee;
}
