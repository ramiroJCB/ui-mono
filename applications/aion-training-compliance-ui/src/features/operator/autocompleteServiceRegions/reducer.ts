import { Actions } from './actions/fetchAutocompleteServiceRegions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IServiceRegion } from '@pec/aion-ui-core/interfaces/serviceRegion';
export type State = DeepReadonly<{
  isFetching: boolean;
  autocompleteServiceRegions: IServiceRegion[];
  totalCount: number;
  error: AxiosError | null;
  currentPage: number;
}>;

export const initialState: State = {
  isFetching: false,
  autocompleteServiceRegions: [],
  totalCount: 0,
  currentPage: 1,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_AUTOCOMPLETE_SERVICE_REGIONS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_SERVICE_REGIONS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        autocompleteServiceRegions: action.payload,
        totalCount: action.totalCount,
        currentPage: action.currentPage,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_SERVICE_REGIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
