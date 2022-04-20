import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITask } from '@pec/aion-ui-core/interfaces/task';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractorTasks: ITask[];
  error: AxiosError | null;
  totalContractorTasksCount: number;
}>;

export const initialState: State = {
  isFetching: false,
  contractorTasks: [],
  error: null,
  totalContractorTasksCount: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CONTRACTOR_TASKS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CONTRACTOR_TASKS_SUCCESS':
      return {
        isFetching: false,
        contractorTasks: action.payload,
        totalContractorTasksCount: action.totalCount,
        error: null
      };
    case 'FETCH_CONTRACTOR_TASKS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
