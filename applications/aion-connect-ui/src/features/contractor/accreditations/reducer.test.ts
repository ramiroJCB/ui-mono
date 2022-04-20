import { accreditations, error } from '../../../../fixtures';
import { IAccreditation } from 'interfaces/accreditation';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const accreditation = accreditations[0];

beforeEach(() => {
  prevState = initialState;
});

describe('accreditations reducer', () => {
  it('should update state correctly when dispatching FETCH_ACCREDITATIONS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_ACCREDITATIONS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_ACCREDITATIONS_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_ACCREDITATIONS_SUCCESS',
      payload: accreditations
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.accreditations).toEqual(accreditations);
  });

  it('should update state correctly when dispatching ADD_ACCREDITATION_SUCCESS', () => {
    const newAccreditation: IAccreditation = {
      id: '3e388408-4c4a-4ace-ab84-25b2e0414c7e',
      name: 'Underwater Welding Safety',
      issueDateUtc: '2018-08-15T03:00:00Z',
      accreditationId: 'UWWSFR-2019-3768z',
      organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
      isDeleted: false
    };

    const nextState = reducer(prevState, {
      type: 'ADD_ACCREDITATION_SUCCESS',
      payload: newAccreditation
    });

    expect(nextState.accreditations).toEqual(
      [newAccreditation, ...prevState.accreditations].sort((a, b) => a.name.localeCompare(b.name))
    );
  });

  it('should update state correctly when dispatching EDIT_ACCREDITATION_SUCCESS', () => {
    const editedAccreditation: IAccreditation = { ...accreditation, name: 'Super Underwater Welding' };

    prevState = reducer(prevState, {
      type: 'FETCH_ACCREDITATIONS_SUCCESS',
      payload: accreditations
    });

    const nextState = reducer(prevState, {
      type: 'EDIT_ACCREDITATION_SUCCESS',
      payload: editedAccreditation
    });

    expect(nextState.accreditations).toEqual(
      prevState.accreditations.map(accreditation =>
        accreditation.id === editedAccreditation.id ? editedAccreditation : accreditation
      )
    );
  });

  it('should update state correctly when dispatching DELETE_ACCREDITATION_SUCCESS', () => {
    prevState = reducer(prevState, {
      type: 'FETCH_ACCREDITATIONS_SUCCESS',
      payload: accreditations
    });

    const nextState = reducer(prevState, {
      type: 'DELETE_ACCREDITATION_SUCCESS',
      payload: accreditation.id
    });

    expect(nextState.accreditations).toEqual(accreditations.filter(({ id }) => id !== accreditation.id));
  });

  it('should update state correctly when dispatching FETCH_ACCREDITATIONS_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_ACCREDITATIONS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
