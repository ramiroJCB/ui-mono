import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IWorker } from 'interfaces/worker';
import { WorkerActions as Actions } from 'combineActions';

export type State = DeepReadonly<{
  isFetching: boolean;
  worker: IWorker | null;
  error: AxiosError | Error | null;
}>;

export const initialState: State = {
  isFetching: false,
  worker: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_WORKER_REQUEST':
    case 'UPDATE_WORKER_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_WORKER_SUCCESS':
    case 'UPDATE_WORKER_SUCCESS':
      return {
        isFetching: false,
        worker: action.payload,
        error: null
      };
    case 'FETCH_WORKER_FAILURE':
    case 'UPDATE_WORKER_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
