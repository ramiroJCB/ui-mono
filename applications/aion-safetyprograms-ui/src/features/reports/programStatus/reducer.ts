import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IProgramStatus } from 'interfaces/programStatus';
import { Actions } from '../programStatus/actions/fetchProgramStatusData';

export type State = DeepReadonly<{
  isFetching: boolean;
  search: string;
  programStatusData: IProgramStatus[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  search: '',
  programStatusData: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_PROGRAM_STATUS_DATA_REQUEST':
      return {
        ...state,
        isFetching: true,
        search: action.search,
        error: null
      };
    case 'FETCH_PROGRAM_STATUS_DATA_SUCCESS':
      return {
        ...state,
        isFetching: false,
        programStatusData: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_PROGRAM_STATUS_DATA_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
