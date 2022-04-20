import { Actions as FetchAutocompleteContractorsAction } from './actions/fetchAutocompleteContractors';
import { Actions as FetchAutocompleteContractorsForValidationAction } from './actions/fetchAutocompleteContractorsForValidation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IContractor } from 'interfaces/contractor';
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';

export type State = DeepReadonly<{
  isFetching: boolean;
  autocompleteContractors: IContractor[];
  workGroupJobTypeContractors: IOperatorWorkGroupJobTypeContractor[];
  totalCount: number;
  error: AxiosError | null;
  currentPage: number;
}>;

type Actions = FetchAutocompleteContractorsAction | FetchAutocompleteContractorsForValidationAction;

export const initialState: State = {
  isFetching: false,
  autocompleteContractors: [],
  workGroupJobTypeContractors: [],
  totalCount: 0,
  currentPage: 1,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_AUTOCOMPLETE_CONTRACTORS_REQUEST':
    case 'FETCH_AUTOCOMPLETE_CONTRACTORS_FOR_VALIDATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_CONTRACTORS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        autocompleteContractors: action.payload,
        totalCount: action.totalCount,
        currentPage: action.currentPage,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_CONTRACTORS_FOR_VALIDATION_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupJobTypeContractors: action.payload,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_CONTRACTORS_FAILURE':
    case 'FETCH_AUTOCOMPLETE_CONTRACTORS_FOR_VALIDATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
