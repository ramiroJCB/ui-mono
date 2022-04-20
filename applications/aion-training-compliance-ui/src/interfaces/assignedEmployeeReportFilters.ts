import { DeepReadonly } from 'ts-essentials';
import { IClientAssignedEmployee } from './clientAssignedEmployee';
import { IContractor } from './contractor';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';

interface ISelectOption {
  value: string;
  label: string;
}

export interface IAssignedEmployeeReportFilters {
  employees?: DeepReadonly<IClientAssignedEmployee[]>;
  contractors?: DeepReadonly<IContractor[]>;
  workGroups?: DeepReadonly<IWorkGroup[]>;
  jobTypes?: DeepReadonly<IJobType[]>;
  trainings?: DeepReadonly<ITrainingRequirement[]>;
  status?: ISelectOption;
}
