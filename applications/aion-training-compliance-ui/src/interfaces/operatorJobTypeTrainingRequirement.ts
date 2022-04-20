import { IJobTypeTrainingRequirement } from './jobTypeTrainingRequirement';

export interface IOperatorJobTypeTrainingRequirement extends IJobTypeTrainingRequirement {
  compliantContractorCount: number;
  totalContractorsCount: number;
  compliantContractorPercentage: number;
  contractorCountUpdatedDateUtc: string;
}
