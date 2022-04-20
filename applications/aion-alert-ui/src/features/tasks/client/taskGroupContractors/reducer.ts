import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITaskAssignee } from 'interfaces/taskAssignee';

export type State = DeepReadonly<{
  isFetching: boolean;
  taskGroupContractors: ITaskAssignee[];
  totalTaskGroupContractorsCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  taskGroupContractors: [],
  totalTaskGroupContractorsCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TASK_GROUP_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_TASK_GROUP_CONTRACTORS_SUCCESS':
      return {
        isFetching: false,
        taskGroupContractors: action.payload,
        totalTaskGroupContractorsCount: action.totalCount,
        error: null
      };
    case 'FETCH_TASK_GROUP_CONTRACTORS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
