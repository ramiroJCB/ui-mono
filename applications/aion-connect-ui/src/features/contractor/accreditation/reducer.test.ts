import { accreditations, error } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const accreditation = accreditations[0];

beforeEach(() => {
  prevState = initialState;
});

describe('accreditation reducer', () => {
  it('should update state correctly when dispatching ADD_ACCREDITATION_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_ACCREDITATION_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching ADD_ACCREDITATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_ACCREDITATION_SUCCESS',
      payload: accreditation
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.accreditation).toEqual(accreditation);
  });

  it('should update state correctly when dispatching EDIT_ACCREDITATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_ACCREDITATION_SUCCESS',
      payload: accreditation
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.accreditation).toEqual(accreditation);
  });

  it('should update state correctly when dispatching DELETE_ACCREDITATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_ACCREDITATION_SUCCESS',
      payload: accreditation.id
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.accreditation).toBeNull();
  });

  it('should update state correctly when dispatching ADD_ACCREDITATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_ACCREDITATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching EDIT_ACCREDITATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_ACCREDITATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching DELETE_ACCREDITATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_ACCREDITATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
