import { IJobTypeTrainingRequirement } from './jobTypeTrainingRequirement';

export interface IContractorJobTypeTrainingRequirement extends IJobTypeTrainingRequirement {
  contractorId: string;
  contractorName: string;
  organizationId: string;
  compliantEmployeeCount: number;
  totalEmployeeCount: number;
  compliantEmployeePercentage: number;
  employeeCountUpdatedDateUtc: string;
}
