import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';

export interface IJobTypeTrainingRequirement {
  id: string;
  trainingRequirementName: string;
  jobTypeId: string;
  trainingRequirementId: string;
  isDeleted: boolean;
  trainingRequirement?: ITrainingRequirement;
  organizationId: string | null;
}
