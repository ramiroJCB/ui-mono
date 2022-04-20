import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';

export type State = DeepReadonly<{
  isFetching: boolean;
  organization: IOrganization | null;
  error: AxiosError | Error | null;
}>;

export const initialState: State = {
  isFetching: false,
  organization: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CONTRACTOR_ORGANIZATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CONTRACTOR_ORGANIZATION_SUCCESS':
      return {
        isFetching: false,
        organization: action.payload,
        error: null
      };
    case 'FETCH_CONTRACTOR_ORGANIZATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
