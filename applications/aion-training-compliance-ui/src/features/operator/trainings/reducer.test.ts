import { AxiosError } from 'axios';
import { initialState, reducer, State } from './reducer';
import { ITrainingRequirement } from '../../../interfaces/trainingRequirement';
import { trainingRequirements } from '../../../../fixtures/trainingRequirements';

let prevState: State;

beforeEach(() => {
  prevState = initialState;
});

describe('trainings reducer', () => {
  it('should update state correctly when dispatching FETCH_TRAININGS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TRAININGS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_TRAININGS_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TRAININGS_SUCCESS',
      payload: trainingRequirements,
      totalCount: trainingRequirements.length
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(prevState.trainings).not.toEqual(trainingRequirements);
    expect(nextState.trainings).toEqual(
      trainingRequirements.sort((a: ITrainingRequirement, b: ITrainingRequirement) => a.name.localeCompare(b.name))
    );
    expect(prevState.totalCount).toEqual(initialState.totalCount);
    expect(nextState.totalCount).toEqual(trainingRequirements.length);
  });

  it('should prevent duplicates when dispatching FETCH_TRAININGS_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TRAININGS_SUCCESS',
      payload: trainingRequirements.concat(trainingRequirements),
      totalCount: trainingRequirements.length
    });

    expect(nextState.trainings).toHaveLength(1);
  });

  it('should update state correctly when dispatching FETCH_TRAININGS_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: {},
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_TRAININGS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching RESET_TRAININGS', () => {
    const prevState = reducer(initialState, {
      type: 'FETCH_TRAININGS_SUCCESS',
      payload: trainingRequirements,
      totalCount: trainingRequirements.length
    });

    const nextState = reducer(prevState, {
      type: 'FETCH_INITIAL_TRAININGS_REQUEST'
    });

    expect(nextState.isFetchingInitial).toBeTruthy();
    expect(nextState.trainings).toHaveLength(0);
    expect(nextState.totalCount).toEqual(0);
  });
});
