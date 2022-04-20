import { initialState, reducer, State as ContractorsState } from './reducer';

let prevState: ContractorsState;

beforeEach(() => {
  prevState = initialState;
});

describe('Contractors reducer', () => {
  it('updates state correctly when dispatching FETCH_CONTRACTORS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTORS_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching FETCH_CONTRACTORS_SUCCESS', () => {
    const contractors = [
      {
        id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
        name: 'Test Contractor'
      }
    ];
    const total = 10;
    const currentPage = 1;

    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTORS_SUCCESS',
      payload: contractors,
      total,
      currentPage
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.currentPage).toBe(currentPage);
    expect(nextState.total).toBe(total);
    expect(nextState.error).toBeNull();
  });

  it('updates state correctly when dispatching FETCH_CONTRACTORS_FAILURE', () => {
    const error = {
      name: 'Test Error',
      config: {},
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTORS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBe(error);
  });
});
