import { Actions } from 'actions/contractor';
import { AxiosError } from 'axios';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractor: IOrganization | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  contractor: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CONTRACTOR_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CONTRACTOR_SUCCESS':
      return {
        isFetching: false,
        contractor: action.payload,
        error: null
      };
    case 'FETCH_CONTRACTOR_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
