import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IAssignee } from 'interfaces/assignee';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractors: IAssignee[];
  error: AxiosError | null;
  totalContractorsCount: number;
}>;

export const initialState: State = {
  isFetching: false,
  contractors: [],
  error: null,
  totalContractorsCount: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_CONTRACTORS_SUCCESS':
      return {
        isFetching: false,
        contractors: action.payload,
        error: null,
        totalContractorsCount: action.totalCount
      };
    case 'FETCH_CLIENT_CONTRACTORS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
