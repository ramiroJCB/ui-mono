import { Actions } from 'actions/fetchVeriforceOrganization';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IVeriforceOrganization } from 'interfaces/veriforceOrganization';

export type State = DeepReadonly<{
  isFetching: boolean;
  username: string | null;
  password: string | null;
  veriforceOrganization: IVeriforceOrganization | null;
  error: AxiosError | null;
}>;

const initialState: State = {
  isFetching: false,
  username: null,
  password: null,
  veriforceOrganization: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_VERIFORCE_ORGANIZATION_REQUEST':
      const { username, password } = action;
      return {
        ...state,
        username,
        password,
        isFetching: true
      };
    case 'FETCH_VERIFORCE_ORGANIZATION_SUCCESS':
      return {
        ...state,
        isFetching: false,
        veriforceOrganization: action.payload,
        error: null
      };
    case 'FETCH_VERIFORCE_ORGANIZATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'RESET_VERIFORCE_ORGANIZATION':
      return {
        ...state,
        isFetching: false,
        veriforceOrganization: null,
        error: null
      };
    default:
      return state;
  }
}
