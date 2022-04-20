import { error, references } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const reference = references[0];

beforeEach(() => {
  prevState = initialState;
});

describe('reference reducer', () => {
  it('should update state correctly when dispatching ADD_REFERENCE_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_REFERENCE_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching ADD_REFERENCE_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_REFERENCE_SUCCESS',
      payload: reference
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.reference).toEqual(reference);
  });

  it('should update state correctly when dispatching EDIT_REFERENCE_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_REFERENCE_SUCCESS',
      payload: reference
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.reference).toEqual(reference);
  });

  it('should update state correctly when dispatching DELETE_REFERENCE_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_REFERENCE_SUCCESS',
      payload: reference.id
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.reference).toBeNull();
  });

  it('should update state correctly when dispatching ADD_REFERENCE_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_REFERENCE_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching EDIT_REFERENCE_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_REFERENCE_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching DELETE_REFERENCE_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_REFERENCE_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
