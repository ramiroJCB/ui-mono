import { error, licenses } from '../../../../fixtures';
import { ILicense } from 'interfaces/license';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const license = licenses[0];

beforeEach(() => {
  prevState = initialState;
});

describe('licenses reducer', () => {
  it('should update state correctly when dispatching FETCH_LICENSES_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_LICENSES_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_LICENSES_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_LICENSES_SUCCESS',
      payload: licenses
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.licenses).toEqual(licenses);
  });

  it('should update state correctly when dispatching ADD_LICENSE_SUCCESS', () => {
    const newLicense: ILicense = {
      id: '3e388408-4c4a-4ace-ab84-25b2e0414c7e',
      name: 'Welding',
      issueDateUtc: '2018-08-15T03:00:00Z',
      licenseId: '	385308A83-02',
      organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
      isDeleted: false
    };

    const nextState = reducer(prevState, {
      type: 'ADD_LICENSE_SUCCESS',
      payload: newLicense
    });

    expect(nextState.licenses).toEqual(
      [newLicense, ...prevState.licenses].sort((a, b) => a.name.localeCompare(b.name))
    );
  });

  it('should update state correctly when dispatching EDIT_LICENSE_SUCCESS', () => {
    const editedLicense: ILicense = { ...license, name: 'Welding' };

    prevState = reducer(prevState, {
      type: 'FETCH_LICENSES_SUCCESS',
      payload: licenses
    });

    const nextState = reducer(prevState, {
      type: 'EDIT_LICENSE_SUCCESS',
      payload: editedLicense
    });

    expect(nextState.licenses).toEqual(
      prevState.licenses.map(license => (license.id === editedLicense.id ? editedLicense : license))
    );
  });

  it('should update state correctly when dispatching DELETE_LICENSE_SUCCESS', () => {
    prevState = reducer(prevState, {
      type: 'FETCH_LICENSES_SUCCESS',
      payload: licenses
    });

    const nextState = reducer(prevState, {
      type: 'DELETE_LICENSE_SUCCESS',
      payload: license.id
    });

    expect(nextState.licenses).toEqual(licenses.filter(({ id }) => id !== license.id));
  });

  it('should update state correctly when dispatching FETCH_LICENSES_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_LICENSES_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
