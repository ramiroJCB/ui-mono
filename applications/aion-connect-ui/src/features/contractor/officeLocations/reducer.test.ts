import { error, officeLocations } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';
import { IOfficeLocation, OfficeLocationType } from 'interfaces/officeLocation';

let prevState: State;
const officeLocation = officeLocations[0];

beforeEach(() => {
  prevState = initialState;
});

describe('office locations reducer', () => {
  it('should update state correctly when dispatching FETCH_OFFICE_LOCATIONS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_OFFICE_LOCATIONS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_OFFICE_LOCATIONS_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_OFFICE_LOCATIONS_SUCCESS',
      payload: officeLocations
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.officeLocations).toEqual(officeLocations);
  });

  it('should update state correctly when dispatching ADD_OFFICE_LOCATION_SUCCESS', () => {
    const newOfficeLocation: IOfficeLocation = {
      id: 'fd6b3740-1d00-4d4a-ae69-7a0911d2c8e1',
      organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
      type: OfficeLocationType.AdditionalOffice,
      name: 'Secondary Office',
      streetAddress: '456 Industrial Dr',
      city: 'Covington',
      state: 'LA',
      postalCode: '70433',
      isDeleted: false
    };

    const nextState = reducer(prevState, {
      type: 'ADD_OFFICE_LOCATION_SUCCESS',
      payload: newOfficeLocation
    });

    expect(nextState.officeLocations).toEqual(
      [newOfficeLocation, ...prevState.officeLocations].sort((a, b) => a.name.localeCompare(b.name))
    );
  });

  it('should update state correctly when dispatching EDIT_OFFICE_LOCATION_SUCCESS', () => {
    const editedOfficeLocation: IOfficeLocation = { ...officeLocation, name: 'Welding' };

    prevState = reducer(prevState, {
      type: 'FETCH_OFFICE_LOCATIONS_SUCCESS',
      payload: officeLocations
    });

    const nextState = reducer(prevState, {
      type: 'EDIT_OFFICE_LOCATION_SUCCESS',
      payload: editedOfficeLocation
    });

    expect(nextState.officeLocations).toEqual(
      prevState.officeLocations.map(officeLocation =>
        officeLocation.id === editedOfficeLocation.id ? editedOfficeLocation : officeLocation
      )
    );
  });

  it('should update state correctly when dispatching DELETE_OFFICE_LOCATION_SUCCESS', () => {
    prevState = reducer(prevState, {
      type: 'FETCH_OFFICE_LOCATIONS_SUCCESS',
      payload: officeLocations
    });

    const nextState = reducer(prevState, {
      type: 'DELETE_OFFICE_LOCATION_SUCCESS',
      payload: officeLocation.id
    });

    expect(nextState.officeLocations).toEqual(officeLocations.filter(({ id }) => id !== officeLocation.id));
  });

  it('should update state correctly when dispatching FETCH_OFFICE_LOCATIONS_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_OFFICE_LOCATIONS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
