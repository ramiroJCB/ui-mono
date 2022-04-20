import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITaskGroup } from '@pec/aion-ui-core/interfaces/taskGroup';

export type State = DeepReadonly<{
  isFetching: boolean;
  taskGroups: ITaskGroup[];
  error: AxiosError | null;
  totalTaskGroupsCount: number;
}>;

export const initialState: State = {
  isFetching: false,
  taskGroups: [],
  totalTaskGroupsCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TASK_GROUPS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_TASK_GROUPS_SUCCESS':
      return {
        isFetching: false,
        taskGroups: action.payload,
        totalTaskGroupsCount: action.totalCount,
        error: null
      };
    case 'FETCH_TASK_GROUPS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
