import { contactInformation, error } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;

beforeEach(() => {
  prevState = initialState;
});

describe('contactInformation reducer', () => {
  it('should update state correctly when dispatching ADD_CONTACT_INFORMATION_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_CONTACT_INFORMATION_REQUEST'
    });

    expect(prevState.contactInformation).toBeNull();
    expect(nextState.error).toBeNull();
  });

  it('should update state correctly when dispatching ADD_CONTACT_INFORMATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_CONTACT_INFORMATION_SUCCESS',
      payload: contactInformation
    });

    expect(nextState.error).toBeNull();
    expect(nextState.contactInformation).toEqual(contactInformation);
  });

  it('should update state correctly when dispatching EDIT_CONTACT_INFORMATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_CONTACT_INFORMATION_SUCCESS',
      payload: contactInformation
    });

    expect(nextState.error).toBeNull();
    expect(nextState.contactInformation).toEqual(contactInformation);
  });

  it('should update state correctly when dispatching ADD_CONTACT_INFORMATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_CONTACT_INFORMATION_FAILURE',
      error
    });

    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching EDIT_CONTACT_INFORMATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_CONTACT_INFORMATION_FAILURE',
      error
    });

    expect(nextState.error).toEqual(error);
  });
});
