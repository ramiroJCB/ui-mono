import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';

export interface IAddJobTypeForm {
  name: string;
  organizationId: string;
  description: string | null;
  trainings: ITrainingRequirement[] | null;
}
