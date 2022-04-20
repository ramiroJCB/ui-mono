import { error, references } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';
import { IReference } from 'interfaces/reference';

let prevState: State;
const reference = references[0];

beforeEach(() => {
  prevState = initialState;
});

describe('references reducer', () => {
  it('should update state correctly when dispatching FETCH_REFERENCES_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_REFERENCES_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_REFERENCES_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_REFERENCES_SUCCESS',
      payload: references
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.references).toEqual(references);
  });

  it('should update state correctly when dispatching ADD_REFERENCE_SUCCESS', () => {
    const newReference: IReference = {
      id: '06434b37-244c-4100-aa9e-de42ce6c4e86',
      name: 'Fox Mulder',
      phoneNumber: '9856965555',
      emailAddress: 'foxySmolder@hotttmail.com',
      notes:
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
      isDeleted: false
    };

    const nextState = reducer(prevState, {
      type: 'ADD_REFERENCE_SUCCESS',
      payload: newReference
    });

    expect(nextState.references).toEqual(
      [newReference, ...prevState.references].sort((a, b) => a.name.localeCompare(b.name))
    );
  });

  it('should update state correctly when dispatching EDIT_REFERENCE_SUCCESS', () => {
    const editedReference: IReference = { ...reference, name: 'Welding' };

    prevState = reducer(prevState, {
      type: 'FETCH_REFERENCES_SUCCESS',
      payload: references
    });

    const nextState = reducer(prevState, {
      type: 'EDIT_REFERENCE_SUCCESS',
      payload: editedReference
    });

    expect(nextState.references).toEqual(
      prevState.references.map(reference => (reference.id === editedReference.id ? editedReference : reference))
    );
  });

  it('should update state correctly when dispatching DELETE_REFERENCE_SUCCESS', () => {
    prevState = reducer(prevState, {
      type: 'FETCH_REFERENCES_SUCCESS',
      payload: references
    });

    const nextState = reducer(prevState, {
      type: 'DELETE_REFERENCE_SUCCESS',
      payload: reference.id
    });

    expect(nextState.references).toEqual(references.filter(({ id }) => id !== reference.id));
  });

  it('should update state correctly when dispatching FETCH_REFERENCES_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_REFERENCES_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
