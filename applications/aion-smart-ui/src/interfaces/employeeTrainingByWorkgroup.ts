import { IWorkGroupJobTypeEmployeeTraining } from '@pec/aion-ui-core/interfaces/workGroupJobTypeEmployeeTraining';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';

export interface IJobTypeWithRequirements extends IWorkGroupJobTypeEmployeeTraining, ITrainingRequirement {}

export interface IEmployeeTrainingByWorkGroup {
  [id: string]: {
    workGroupId: string;
    jobTypes: {
      [id: string]: {
        jobTypeName: string;
        jobTypeId: string;
        trainingRequirements: IJobTypeWithRequirements[];
      };
    };
  };
}
