import { Actions } from 'actions/trainingRequirements';
import { AxiosError } from 'axios';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  isFetching: boolean;
  trainingRequirements: IEmployeeTrainingRequirement[] | null;
  error: AxiosError | null;
  employeeId: string | null;
}>;

export const initialState: State = {
  isFetching: false,
  trainingRequirements: null,
  error: null,
  employeeId: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TRAINING_REQUIREMENTS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_TRAINING_REQUIREMENTS_SUCCESS':
      return {
        isFetching: false,
        trainingRequirements: action.payload.filter(r => r.isCertified),
        error: null,
        employeeId: action.employeeId
      };
    case 'FETCH_TRAINING_REQUIREMENTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
