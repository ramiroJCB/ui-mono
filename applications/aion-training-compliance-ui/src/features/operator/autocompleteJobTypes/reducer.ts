import { Actions as FetchAutocompleteJobTypesAction } from './actions/fetchAutocompleteJobTypes';
import { Actions as FetchAutocompleteJobTypesForValidationAction } from './actions/fetchAutocompleteJobTypesForValidation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';

export type State = DeepReadonly<{
  isFetching: boolean;
  autocompleteJobTypes: IJobType[];
  workGroupJobTypes: IWorkGroupJobType[];
  totalCount: number;
  error: AxiosError | null;
  currentPage: number;
}>;

type Actions = FetchAutocompleteJobTypesAction | FetchAutocompleteJobTypesForValidationAction;

export const initialState: State = {
  isFetching: false,
  autocompleteJobTypes: [],
  workGroupJobTypes: [],
  totalCount: 0,
  currentPage: 1,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_AUTOCOMPLETE_JOB_TYPES_REQUEST':
    case 'FETCH_AUTOCOMPLETE_JOB_TYPES_FOR_VALIDATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_JOB_TYPES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        autocompleteJobTypes: action.payload,
        totalCount: action.totalCount,
        currentPage: action.currentPage,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_JOB_TYPES_FOR_VALIDATION_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupJobTypes: action.payload,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_JOB_TYPES_FAILURE':
    case 'FETCH_AUTOCOMPLETE_JOB_TYPES_FOR_VALIDATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
