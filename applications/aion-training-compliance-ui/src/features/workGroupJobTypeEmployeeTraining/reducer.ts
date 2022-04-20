import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroupJobTypeEmployeeTraining } from '@pec/aion-ui-core/interfaces/workGroupJobTypeEmployeeTraining';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  workGroupJobTypeEmployeeTraining: IWorkGroupJobTypeEmployeeTraining[];
  totalCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  workGroupJobTypeEmployeeTraining: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_WORK_GROUP_JOB_TYPE_EMPLOYEE_TRAINING_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        workGroupJobTypeEmployeeTraining: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_TRAINING_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_TRAINING_SUCCESS':
      const combined = state.workGroupJobTypeEmployeeTraining.concat(action.payload);
      const uniqueById = Array.from(
        new Set(combined.map(({ jobTypeTrainingRequirementId }) => jobTypeTrainingRequirementId))
      ).map(jobTypeTrainingRequirementId =>
        combined.find(c => c.jobTypeTrainingRequirementId === jobTypeTrainingRequirementId)
      ) as IWorkGroupJobTypeEmployeeTraining[];

      return {
        isFetchingInitial: false,
        isFetching: false,
        workGroupJobTypeEmployeeTraining: uniqueById.sort((a, b) =>
          a.trainingRequirementName.localeCompare(b.trainingRequirementName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_TRAINING_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
