import { certifications, error } from '../../../../fixtures';
import { ICertification } from 'interfaces/certification';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const certification = certifications[0];

beforeEach(() => {
  prevState = initialState;
});

describe('certifications reducer', () => {
  it('should update state correctly when dispatching FETCH_CERTIFICATIONS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CERTIFICATIONS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_CERTIFICATIONS_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CERTIFICATIONS_SUCCESS',
      payload: certifications
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.certifications).toEqual(certifications);
  });

  it('should update state correctly when dispatching ADD_CERTIFICATION_SUCCESS', () => {
    const newCertification: ICertification = {
      id: '3e388408-4c4a-4ace-ab84-25b2e0414c7e',
      name: 'Welding',
      issueDateUtc: '2018-08-15T03:00:00Z',
      certificationId: '385308A83-02',
      organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
      isDeleted: false
    };

    const nextState = reducer(prevState, {
      type: 'ADD_CERTIFICATION_SUCCESS',
      payload: newCertification
    });

    expect(nextState.certifications).toEqual(
      [newCertification, ...prevState.certifications].sort((a, b) => a.name.localeCompare(b.name))
    );
  });

  it('should update state correctly when dispatching EDIT_CERTIFICATION_SUCCESS', () => {
    const editedCertification: ICertification = { ...certification, name: 'Welding' };

    prevState = reducer(prevState, {
      type: 'FETCH_CERTIFICATIONS_SUCCESS',
      payload: certifications
    });

    const nextState = reducer(prevState, {
      type: 'EDIT_CERTIFICATION_SUCCESS',
      payload: editedCertification
    });

    expect(nextState.certifications).toEqual(
      prevState.certifications.map(certification =>
        certification.id === editedCertification.id ? editedCertification : certification
      )
    );
  });

  it('should update state correctly when dispatching DELETE_CERTIFICATION_SUCCESS', () => {
    prevState = reducer(prevState, {
      type: 'FETCH_CERTIFICATIONS_SUCCESS',
      payload: certifications
    });

    const nextState = reducer(prevState, {
      type: 'DELETE_CERTIFICATION_SUCCESS',
      payload: certification.id
    });

    expect(nextState.certifications).toEqual(certifications.filter(({ id }) => id !== certification.id));
  });

  it('should update state correctly when dispatching FETCH_CERTIFICATIONS_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CERTIFICATIONS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
