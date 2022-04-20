import { reducer } from './workers';
import { workers } from '../../fixtures/workers';
import { WorkerStatus } from '../interfaces/worker';

it('returns workers who have been checked in', () => {
  expect(
    reducer(
      {
        isFetching: false,
        workers: workers.slice(1, 3),
        error: null
      },
      {
        type: 'UPDATE_WORKER_SUCCESS',
        payload: {
          ...workers[8],
          status: WorkerStatus.CheckedIn
        },
        workersOffset: 0
      }
    ).workers
  ).toEqual([workers[1], workers[8], workers[2]]);
});

it('returns workers who live on site', () => {
  expect(
    reducer(
      {
        isFetching: false,
        workers: workers.slice(1, 3),
        error: null
      },
      {
        type: 'UPDATE_WORKER_SUCCESS',
        payload: {
          ...workers[12],
          livesOnSite: true
        },
        workersOffset: 0
      }
    ).workers
  ).toEqual([workers[1], workers[2], workers[12]]);
});

it('removes workers who are checked out and do not live on site', () => {
  expect(
    reducer(
      {
        isFetching: false,
        workers: workers.slice(1, 4),
        error: null
      },
      {
        type: 'UPDATE_WORKER_SUCCESS',
        payload: {
          ...workers[3],
          status: WorkerStatus.CheckedOut,
          livesOnSite: false
        },
        workersOffset: 0
      }
    ).workers
  ).toEqual([workers[1], workers[2]]);
});
