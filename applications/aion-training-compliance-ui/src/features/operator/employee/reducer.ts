import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IEmployee } from 'interfaces/employee';

export type State = DeepReadonly<{
  isFetching: boolean;
  employee: IEmployee | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  employee: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_EMPLOYEE_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_EMPLOYEE_SUCCESS':
      return {
        isFetching: false,
        employee: action.payload,
        error: null
      };
    case 'FETCH_EMPLOYEE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
