import { Actions } from 'actions/organizations';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';

export type State = DeepReadonly<{
  error: AxiosError | Error | null;
  isFetching: boolean;
  organizations: IOrganization[] | null;
  searchTerm: string;
  numResults: number;
}>;

const initialState: State = {
  error: null,
  isFetching: false,
  organizations: null,
  searchTerm: '',
  numResults: 0
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
        error: null,
        isFetching: false,
        organizations: action.payload,
        numResults: action.numResults
      };
    case 'FETCH_ORGANIZATIONS_FAILURE':
      return {
        ...state,
        error: action.error,
        isFetching: false
      };
    default:
      return state;
  }
}
