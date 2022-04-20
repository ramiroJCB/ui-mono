import { Actions as AddRequestmentOverrideActions } from './actions/addRequirementOverride';
import { Actions as DeleteRequirementOverrideActions } from './actions/deleteRequirementOverride';
import { Actions as FetchRequirementOverridesActions } from './actions/fetchRequirementOverrides';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRequirementOverride } from 'interfaces/requirementOverride';

export type State = DeepReadonly<{
  isFetching: boolean;
  total: number | null;
  requirementOverrides: IRequirementOverride[] | null;
  error: AxiosError | null;
}>;

type Actions = AddRequestmentOverrideActions | DeleteRequirementOverrideActions | FetchRequirementOverridesActions;

export const initialState: State = {
  isFetching: false,
  requirementOverrides: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'DELETE_REQUIREMENT_OVERRIDE_REQUEST':
    case 'FETCH_REQUIREMENT_OVERRIDES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_REQUIREMENT_OVERRIDES_SUCCESS':
      return {
        isFetching: false,
        requirementOverrides: action.payload,
        total: action.total,
        error: null
      };
    case 'ADD_REQUIREMENT_OVERRIDE_FAILURE':
    case 'DELETE_REQUIREMENT_OVERRIDE_FAILURE':
    case 'FETCH_REQUIREMENT_OVERRIDES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
