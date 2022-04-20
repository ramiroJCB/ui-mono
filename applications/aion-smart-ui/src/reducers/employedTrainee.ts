import { Actions } from 'actions/createEmployedTrainee';
import { AxiosError } from 'axios';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  isFetching: boolean;
  employedTrainee: ITraineeWithEmployees | null;
  error: AxiosError | Error | null;
}>;

export const initialState: State = {
  isFetching: false,
  employedTrainee: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'CREATE_EMPLOYED_TRAINEE_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'CREATE_EMPLOYED_TRAINEE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        employedTrainee: action.payload,
        error: null
      };
    case 'CREATE_EMPLOYED_TRAINEE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
