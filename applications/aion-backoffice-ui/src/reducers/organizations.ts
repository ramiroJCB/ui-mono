import { Actions } from 'actions/organizations';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';

export type State = DeepReadonly<{
  readonly isFetching: boolean;
  readonly organizations: IOrganization[] | null;
  readonly error: AxiosError | Error | null;
  readonly searchTerm: string;
  readonly currentPage: string;
  readonly pageSize: number;
  readonly totalCount: number;
}>;

const initialState: State = {
  isFetching: false,
  organizations: null,
  error: null,
  searchTerm: '',
  currentPage: '0',
  pageSize: 0,
  totalCount: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_ORGANIZATIONS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_ORGANIZATIONS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        organizations: action.payload,
        searchTerm: action.search,
        currentPage: action.page,
        pageSize: action.pageSize,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_ORGANIZATIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
