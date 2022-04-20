import { error, officeLocations } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const officeLocation = officeLocations[0];

beforeEach(() => {
  prevState = initialState;
});

describe('office location reducer', () => {
  it('should update state correctly when dispatching ADD_OFFICE_LOCATION_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_OFFICE_LOCATION_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching ADD_OFFICE_LOCATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_OFFICE_LOCATION_SUCCESS',
      payload: officeLocation
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.officeLocation).toEqual(officeLocation);
  });

  it('should update state correctly when dispatching EDIT_OFFICE_LOCATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_OFFICE_LOCATION_SUCCESS',
      payload: officeLocation
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.officeLocation).toEqual(officeLocation);
  });

  it('should update state correctly when dispatching DELETE_OFFICE_LOCATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_OFFICE_LOCATION_SUCCESS',
      payload: officeLocation.id
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.officeLocation).toBeNull();
  });

  it('should update state correctly when dispatching ADD_OFFICE_LOCATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_OFFICE_LOCATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching EDIT_OFFICE_LOCATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_OFFICE_LOCATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching DELETE_OFFICE_LOCATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_OFFICE_LOCATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
