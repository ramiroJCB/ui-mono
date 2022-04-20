import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IContractor } from 'interfaces/contractor';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractorTags: IContractor[] | null;
  error: AxiosError | null;
  currentPage: number;
  total: number;
}>;

export const initialState: State = {
  isFetching: false,
  contractorTags: null,
  error: null,
  currentPage: 1,
  total: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CONTRACTOR_TAGS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CONTRACTOR_TAGS_SUCCESS':
      return {
        isFetching: false,
        contractorTags: action.payload,
        error: null,
        currentPage: action.currentPage,
        total: action.total
      };
    case 'FETCH_CONTRACTOR_TAGS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
