import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IClientAssignedEmployee } from 'interfaces/clientAssignedEmployee';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  clientAssignedEmployees: IClientAssignedEmployee[];
  totalCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  clientAssignedEmployees: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_CLIENT_ASSIGNED_EMPLOYEES_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        clientAssignedEmployees: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_CLIENT_ASSIGNED_EMPLOYEES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CLIENT_ASSIGNED_EMPLOYEES_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        clientAssignedEmployees: uniqueById(state.clientAssignedEmployees, action.payload).sort((a, b) =>
          a.employeeName.localeCompare(b.employeeName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_CLIENT_ASSIGNED_EMPLOYEES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
