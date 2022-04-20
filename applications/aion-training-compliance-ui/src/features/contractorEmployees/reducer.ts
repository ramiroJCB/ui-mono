import { Actions } from './actions/contractorEmployees';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  contractorEmployees: IWorkGroupJobTypeEmployee[];
  error: AxiosError | null;
  totalCount: number;
}>;

export const initialState: State = {
  isFetchingInitial: false,
  contractorEmployees: [],
  error: null,
  totalCount: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_CONTRACTOR_EMPLOYEES_REQUEST':
      return {
        ...state,
        contractorEmployees: [],
        totalCount: 0,
        isFetchingInitial: true,
        error: null
      };
    case 'FETCH_CONTRACTOR_EMPLOYEES_REQUEST':
      return {
        ...state,
        error: null
      };
    case 'FETCH_CONTRACTOR_EMPLOYEES_SUCCESS':
      return {
        ...state,
        isFetchingInitial: false,
        contractorEmployees: uniqueById(state.contractorEmployees, action.payload).sort((a, b) =>
          a.employeeName.localeCompare(b.employeeName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_CONTRACTOR_EMPLOYEES_FAILURE':
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
