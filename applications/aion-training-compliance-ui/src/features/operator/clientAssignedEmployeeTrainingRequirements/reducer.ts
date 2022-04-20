import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IClientAssignedEmployeeTrainingRequirement } from 'interfaces/clientAssignedEmployeeTrainingRequirement';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  clientAssignedEmployeeTrainingRequirements: IClientAssignedEmployeeTrainingRequirement[];
  totalCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  clientAssignedEmployeeTrainingRequirements: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_CLIENT_ASSIGNED_EMPLOYEE_TRAINING_REQUIREMENTS_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        clientAssignedEmployeeTrainingRequirements: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_CLIENT_ASSIGNED_EMPLOYEE_TRAINING_REQUIREMENTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CLIENT_ASSIGNED_EMPLOYEE_TRAINING_REQUIREMENTS_SUCCESS':
      const combined = state.clientAssignedEmployeeTrainingRequirements.concat(action.payload);
      const uniqueById = Array.from(
        new Set(combined.map(({ trainingRequirementId }) => trainingRequirementId))
      ).map(trainingRequirementId =>
        combined.find(c => c.trainingRequirementId === trainingRequirementId)
      ) as IClientAssignedEmployeeTrainingRequirement[];

      return {
        isFetchingInitial: false,
        isFetching: false,
        clientAssignedEmployeeTrainingRequirements: uniqueById.sort((a, b) =>
          a.trainingRequirementName.localeCompare(b.trainingRequirementName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_CLIENT_ASSIGNED_EMPLOYEE_TRAINING_REQUIREMENTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
