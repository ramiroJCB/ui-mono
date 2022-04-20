import { Actions as FetchSearchResultsActions } from './actions/fetchSearchResults';
import { Actions as FetchSearchResultLogoActions } from './actions/fetchSearchResultLogo';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ISearchContractorsForm } from 'interfaces/searchContractorsForm';
import { ISearchFilters } from 'interfaces/searchFilters';
import { ISearchResultWithLogo } from 'interfaces/searchResult';

export type State = DeepReadonly<{
  isFetching: boolean;
  totalCount: number;
  searchResults: ISearchResultWithLogo[];
  searchFilters: ISearchFilters | null;
  values: ISearchContractorsForm;
  error: AxiosError | null;
}>;

type Actions = FetchSearchResultLogoActions | FetchSearchResultsActions;

export const initialState: State = {
  isFetching: false,
  totalCount: 0,
  searchResults: [],
  searchFilters: null,
  values: { keyword: '', city: '', state: undefined, distance: undefined, filters: null },
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_SEARCH_RESULT_LOGO_REQUEST':
      return {
        ...state,
        searchResults: state.searchResults.map(result =>
          result.id === action.organizationId ? { ...result, isFetching: true } : result
        )
      };
    case 'FETCH_SEARCH_RESULT_LOGO_SUCCESS':
      return {
        ...state,
        searchResults: state.searchResults.map(result =>
          result.id === action.organizationId
            ? { ...result, logo: action.payload, isFetching: false, hasFetched: true }
            : result
        )
      };
    case 'FETCH_SEARCH_RESULTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_SEARCH_RESULTS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        totalCount: action.totalCount,
        searchResults: action.payload,
        searchFilters: action.searchFilters,
        values: action.values,
        error: null
      };
    case 'FETCH_SEARCH_RESULTS_FAILURE':
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
