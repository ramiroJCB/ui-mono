import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IContractor } from 'interfaces/contractor';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  contractors: IContractor[];
  totalCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  contractors: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        contractors: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CONTRACTORS_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        contractors: uniqueById(state.contractors, action.payload).sort((a, b) => a.name.localeCompare(b.name)),
        totalCount: action.totalCount,
        error: null
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
