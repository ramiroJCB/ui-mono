import { Actions as UpdateWorkerActions } from 'actions/updateWorker';
import { Actions } from 'actions/workers';
import { AxiosError } from 'axios';
import { IWorker, WorkerStatus } from 'interfaces/worker';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  isFetching: boolean;
  workers: IWorker[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  workers: null,
  error: null
};

const sortComparator = (a: IWorker, b: IWorker) =>
  `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);

export function reducer(state: State = initialState, action: Actions | UpdateWorkerActions): State {
  switch (action.type) {
    case 'FETCH_WORKERS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_WORKERS_SUCCESS':
      return {
        isFetching: false,
        workers: action.payload.sort(sortComparator),
        error: null
      };
    case 'FETCH_WORKERS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'UPDATE_WORKER_SUCCESS':
      const { id: workerId } = action.payload;
      const workerIndex = state.workers && state.workers.findIndex(({ id }) => id === workerId);
      if (workerIndex && workerIndex > -1) {
        return {
          ...state,
          workers:
            state.workers &&
            state.workers
              .map(worker => (worker.id === action.payload.id ? action.payload : worker))
              .filter(({ status, livesOnSite }) => status === WorkerStatus.CheckedIn || livesOnSite)
              .sort(sortComparator)
        };
      } else {
        return {
          ...state,
          workers:
            state.workers &&
            state.workers
              .concat(action.payload)
              .map(worker => (worker.id === action.payload.id ? action.payload : worker))
              .filter(({ status, livesOnSite }) => status === WorkerStatus.CheckedIn || livesOnSite)
              .sort(sortComparator)
        };
      }
    default:
      return state;
  }
}
