import { certifications, error } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const certification = certifications[0];

beforeEach(() => {
  prevState = initialState;
});

describe('certification reducer', () => {
  it('should update state correctly when dispatching ADD_CERTIFICATION_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_CERTIFICATION_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching ADD_CERTIFICATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_CERTIFICATION_SUCCESS',
      payload: certification
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.certification).toEqual(certification);
  });

  it('should update state correctly when dispatching EDIT_CERTIFICATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_CERTIFICATION_SUCCESS',
      payload: certification
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.certification).toEqual(certification);
  });

  it('should update state correctly when dispatching DELETE_CERTIFICATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_CERTIFICATION_SUCCESS',
      payload: certification.id
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.certification).toBeNull();
  });

  it('should update state correctly when dispatching ADD_CERTIFICATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_CERTIFICATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching EDIT_CERTIFICATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_CERTIFICATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching DELETE_CERTIFICATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_CERTIFICATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
