import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroupContractor } from 'interfaces/workGroupContractor';

export type State = DeepReadonly<{
  isFetching: boolean;
  workGroupContractor: IWorkGroupContractor | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  workGroupContractor: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_WORK_GROUP_CONTRACTOR_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_WORK_GROUP_CONTRACTOR_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupContractor: action.payload,
        error: null
      };
    case 'FETCH_WORK_GROUP_CONTRACTOR_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
