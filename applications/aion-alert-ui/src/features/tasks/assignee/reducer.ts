import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IContractorAssignee } from 'interfaces/contractorAssignee';

export type State = DeepReadonly<{
  isFetching: boolean;
  assignee: IContractorAssignee | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  assignee: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_ASSIGNEE_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_ASSIGNEE_SUCCESS':
      return {
        isFetching: false,
        assignee: action.payload,
        error: null
      };
    case 'FETCH_ASSIGNEE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
