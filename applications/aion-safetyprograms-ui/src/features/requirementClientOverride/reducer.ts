import { Actions as AddClientRequirementOverrideActions } from './actions/addRequirementClientOverride';
import { Actions as UpdateClientRequirementOverrideActions } from './actions/updateClientRequirementOverride';

import { AxiosError } from 'axios';
import { IClientRequirementOverride } from 'interfaces/requirementOverride';

export type State = {
  isFetching: boolean;
  clientRequirementOverride: IClientRequirementOverride | null;
  error: AxiosError | null;
};

type Actions = AddClientRequirementOverrideActions | UpdateClientRequirementOverrideActions;

export const initialState: State = {
  isFetching: false,
  clientRequirementOverride: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'UPDATE_CLIENT_REQUIREMENT_OVERRIDE_REQUEST':
    case 'ADD_CLIENT_REQUIREMENT_OVERRIDE_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_CLIENT_REQUIREMENT_OVERRIDE_SUCCESS':
    case 'UPDATE_CLIENT_REQUIREMENT_OVERRIDE_SUCCESS':
      return {
        isFetching: false,
        clientRequirementOverride: action.payload,
        error: null
      };
    case 'UPDATE_CLIENT_REQUIREMENT_OVERRIDE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_CLIENT_REQUIREMENT_OVERRIDE_FAILURE':
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}
