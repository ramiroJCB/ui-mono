import { Actions } from 'actions/organizationsForUser';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IUserOrganization } from '@pec/aion-ui-core/interfaces/userOrganization';

export type State = DeepReadonly<{
  isFetching: boolean;
  organizationsForUser: IUserOrganization[] | null;
  error: AxiosError | Error | null;
}>;

const initialState: State = {
  isFetching: false,
  organizationsForUser: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_ORGANIZATIONS_FOR_USER_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_ORGANIZATIONS_FOR_USER_SUCCESS':
      return {
        ...state,
        isFetching: false,
        organizationsForUser: action.payload.sort((a, b) => a.name.localeCompare(b.name)),
        error: null
      };
    case 'FETCH_ORGANIZATIONS_FOR_USER_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
