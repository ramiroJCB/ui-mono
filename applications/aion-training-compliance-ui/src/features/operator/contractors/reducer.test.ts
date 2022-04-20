import { AxiosError } from 'axios';
import { contractors } from '../../../../fixtures/contractors';
import { IContractor } from '../../../interfaces/contractor';
import { initialState, reducer, State } from './reducer';

let prevState: State;

beforeEach(() => {
  prevState = initialState;
});

describe('contractors reducer', () => {
  it('should update state correctly when dispatching FETCH_CONTRACTORS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTORS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_CONTRACTORS_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTORS_SUCCESS',
      payload: contractors,
      totalCount: contractors.length
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(prevState.contractors).not.toEqual(contractors);
    expect(nextState.contractors).toEqual(
      contractors.sort((a: IContractor, b: IContractor) => a.name.localeCompare(b.name))
    );
    expect(prevState.totalCount).toEqual(initialState.totalCount);
    expect(nextState.totalCount).toEqual(contractors.length);
  });

  it('should prevent duplicates when dispatching FETCH_CONTRACTORS_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTORS_SUCCESS',
      payload: contractors.concat(contractors),
      totalCount: contractors.length
    });

    expect(nextState.contractors).toHaveLength(1000);
  });

  it('should update state correctly when dispatching FETCH_CONTRACTORS_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: {},
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTORS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching FETCH_INITIAL_CONTRACTORS_REQUEST', () => {
    const prevState = reducer(initialState, {
      type: 'FETCH_CONTRACTORS_SUCCESS',
      payload: contractors,
      totalCount: contractors.length
    });

    const nextState = reducer(prevState, {
      type: 'FETCH_INITIAL_CONTRACTORS_REQUEST'
    });

    expect(nextState.isFetchingInitial).toBeTruthy();
    expect(nextState.contractors).toHaveLength(0);
    expect(nextState.totalCount).toEqual(0);
  });
});
