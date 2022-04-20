import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITask } from '@pec/aion-ui-core/interfaces/task';

export type State = DeepReadonly<{
  isFetching: boolean;
  clientTasks: ITask[];
  error: AxiosError | null;
  totalClientTasksCount: number;
}>;

export const initialState: State = {
  isFetching: false,
  clientTasks: [],
  error: null,
  totalClientTasksCount: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_TASKS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_TASKS_SUCCESS':
      return {
        isFetching: false,
        clientTasks: action.payload,
        totalClientTasksCount: action.totalCount,
        error: null
      };
    case 'FETCH_CLIENT_TASKS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
