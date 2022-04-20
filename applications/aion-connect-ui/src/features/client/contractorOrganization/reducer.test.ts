import { error, organizations } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const organization = organizations[2];

beforeEach(() => {
  prevState = initialState;
});

describe('contractor organization reducer', () => {
  it('should update state correctly when dispatching FETCH_CONTRACTOR_ORGANIZATION_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTOR_ORGANIZATION_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_CONTRACTOR_ORGANIZATION_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTOR_ORGANIZATION_SUCCESS',
      payload: organization
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.organization).toEqual(organization);
  });

  it('should update state correctly when dispatching FETCH_CONTRACTOR_ORGANIZATION_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTOR_ORGANIZATION_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
