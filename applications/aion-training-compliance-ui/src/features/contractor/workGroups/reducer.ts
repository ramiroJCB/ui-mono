import { Actions as FetchWorkGroupContractorsActions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroupContractor } from 'interfaces/workGroupContractor';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  workGroupContractors: IWorkGroupContractor[];
  totalCount: number;
  error: AxiosError | null;
}>;

type Actions = FetchWorkGroupContractorsActions;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  workGroupContractors: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_WORK_GROUP_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        workGroupContractors: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_WORK_GROUP_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_WORK_GROUP_CONTRACTORS_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        workGroupContractors: uniqueById(state.workGroupContractors, action.payload).sort((a, b) =>
          a.workGroupName.localeCompare(b.workGroupName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_WORK_GROUP_CONTRACTORS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
