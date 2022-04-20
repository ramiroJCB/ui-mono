import { initialState, reducer, State as AssigneeState } from './reducer';

let prevState: AssigneeState;

beforeEach(() => {
  prevState = initialState;
});

describe('Assignee reducer', () => {
  it('updates state correctly when dispatching FETCH_ASSIGNEE_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_ASSIGNEE_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching FETCH_ASSIGNEE_SUCCESS', () => {
    const payload = {
      id: '591e7ac1-11b2-4e42-8dcb-07c5dc6f181b',
      name: 'Test Assignee'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_ASSIGNEE_SUCCESS',
      payload
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.assignee).toEqual(payload);
  });

  it('updates state correctly when dispatching FETCH_ASSIGNEE_FAILURE ', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_ASSIGNEE_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBe(error);
  });
});
