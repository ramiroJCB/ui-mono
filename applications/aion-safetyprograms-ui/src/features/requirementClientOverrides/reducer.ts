import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { Actions } from './fetchRequirementClientOverrides';
import { IClientRequirementOverride } from 'interfaces/requirementOverride';

export type State = DeepReadonly<{
  isFetching: boolean;
  clientRequirementOverrides: IClientRequirementOverride[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  clientRequirementOverrides: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_REQUIREMENT_OVERRIDES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CLIENT_REQUIREMENT_OVERRIDES_SUCCESS':
      return {
        isFetching: false,
        clientRequirementOverrides: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_CLIENT_REQUIREMENT_OVERRIDES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
