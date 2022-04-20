import { Actions as FetchAutocompleteEmployeesAction } from './actions/fetchAutocompleteEmployees';
import { Actions as FetchAutocompleteEmployeesForValidationAction } from './actions/fetchAutocompleteEmployeesForValidation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IEmployee } from 'interfaces/employee';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';

export type State = DeepReadonly<{
  isFetching: boolean;
  autocompleteEmployees: IEmployee[];
  workGroupJobTypeEmployees: IWorkGroupJobTypeEmployee[];
  totalCount: number;
  error: AxiosError | null;
  currentPage: number;
}>;

type Actions = FetchAutocompleteEmployeesAction | FetchAutocompleteEmployeesForValidationAction;

export const initialState: State = {
  isFetching: false,
  autocompleteEmployees: [],
  workGroupJobTypeEmployees: [],
  totalCount: 0,
  currentPage: 1,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_AUTOCOMPLETE_EMPLOYEES_REQUEST':
    case 'FETCH_AUTOCOMPLETE_EMPLOYEES_FOR_VALIDATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_EMPLOYEES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        autocompleteEmployees: action.payload,
        totalCount: action.totalCount,
        currentPage: action.currentPage,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_EMPLOYEES_FOR_VALIDATION_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupJobTypeEmployees: action.payload,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_EMPLOYEES_FAILURE':
    case 'FETCH_AUTOCOMPLETE_EMPLOYEES_FOR_VALIDATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
