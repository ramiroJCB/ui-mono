import { Actions } from '../actions/organizations';
import { AxiosError } from 'axios';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';

export const FETCH_ORGANIZATIONS_REQUEST = 'FETCH_ORGANIZATIONS_REQUEST';
export const FETCH_ORGANIZATIONS_SUCCESS = 'FETCH_ORGANIZATIONS_SUCCESS';
export const FETCH_ORGANIZATIONS_FAILURE = 'FETCH_ORGANIZATIONS_FAILURE';

export type State = {
  readonly error: AxiosError | Error | null;
  readonly isFetching: boolean;
  readonly organizations: IOrganization[] | null;
  readonly searchTerm: string;
  readonly numResults: number;
};

const initialState: State = {
  error: null,
  isFetching: false,
  organizations: null,
  searchTerm: '',
  numResults: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case FETCH_ORGANIZATIONS_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case FETCH_ORGANIZATIONS_SUCCESS:
      return {
        ...state,
        error: null,
        isFetching: false,
        organizations: action.payload,
        searchTerm: action.search,
        numResults: action.numResults
      };
    case FETCH_ORGANIZATIONS_FAILURE:
      return {
        ...state,
        error: action.error,
        isFetching: false
      };
    default:
      return state;
  }
}
