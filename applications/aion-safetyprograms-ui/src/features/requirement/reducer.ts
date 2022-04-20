import { Actions as FetchRequirementActions } from './actions/fetchRequirement';
import { Actions as UpdateRequirementActions } from './actions/updateRequirement';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IContractorRequirement } from 'interfaces/requirement';

export type State = DeepReadonly<{
  isFetching: boolean;
  requirement: IContractorRequirement | null;
  error: AxiosError | null;
}>;

type Actions = FetchRequirementActions | UpdateRequirementActions;

export const initialState: State = {
  isFetching: false,
  requirement: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REQUIREMENT_REQUEST':
    case 'UPDATE_REQUIREMENT_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_REQUIREMENT_SUCCESS':
    case 'UPDATE_REQUIREMENT_SUCCESS':
      return {
        isFetching: false,
        requirement: action.payload,
        error: null
      };
    case 'FETCH_REQUIREMENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'UPDATE_REQUIREMENT_FAILURE':
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}
