import { Actions } from './actions/fetchRequirements';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IClientRequirement, IExpandedRequirement } from 'interfaces/requirement';

export type State = DeepReadonly<{
  isFetching: boolean;
  search: string;
  requirements: IExpandedRequirement[] | null;
  clientRequirements: IClientRequirement[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  search: '',
  requirements: null,
  clientRequirements: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REQUIREMENTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        search: action.search,
        error: null
      };
    case 'FETCH_REQUIREMENTS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        requirements: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_CLIENT_REQUIREMENTS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        clientRequirements: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_REQUIREMENTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
