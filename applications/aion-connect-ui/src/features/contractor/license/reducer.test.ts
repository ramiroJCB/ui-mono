import { error, licenses } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const license = licenses[0];

beforeEach(() => {
  prevState = initialState;
});

describe('license reducer', () => {
  it('should update state correctly when dispatching ADD_LICENSE_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_LICENSE_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching ADD_LICENSE_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_LICENSE_SUCCESS',
      payload: license
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.license).toEqual(license);
  });

  it('should update state correctly when dispatching EDIT_LICENSE_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_LICENSE_SUCCESS',
      payload: license
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.license).toEqual(license);
  });

  it('should update state correctly when dispatching DELETE_LICENSE_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_LICENSE_SUCCESS',
      payload: license.id
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.license).toBeNull();
  });

  it('should update state correctly when dispatching ADD_LICENSE_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_LICENSE_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching EDIT_LICENSE_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_LICENSE_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching DELETE_LICENSE_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_LICENSE_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
