import { Actions as FetchContractorActions } from './actions/fetchContractors';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractors: IOrganization[];
  error: AxiosError | null;
  currentPage: number;
  total: number;
}>;

export const initialState: State = {
  isFetching: false,
  contractors: [],
  error: null,
  currentPage: 1,
  total: 0
};

export function reducer(state: State = initialState, action: FetchContractorActions): State {
  switch (action.type) {
    case 'FETCH_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CONTRACTORS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        contractors: action.payload,
        error: null,
        currentPage: action.currentPage,
        total: action.total
      };
    case 'FETCH_CONTRACTORS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
