import { initialState, reducer, State as ContractorTagsState } from './reducer';

let prevState: ContractorTagsState;

beforeEach(() => {
  prevState = initialState;
});

describe('Contractor Tags reducer', () => {
  it('updates state correctly when dispatching FETCH_CONTRACTOR_TAGS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTOR_TAGS_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });

  it('updates state correctly when dispatching FETCH_CONTRACTOR_TAGS_SUCCESS', () => {
    const contractors = [
      {
        id: 'ff126b98-a956-41e3-a35c-83fb1ff746b8',
        name: 'Test Contractor'
      }
    ];
    const total = 10;
    const currentPage = 1;

    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTOR_TAGS_SUCCESS',
      payload: contractors,
      total,
      currentPage
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.currentPage).toBe(currentPage);
    expect(nextState.total).toBe(total);
    expect(nextState.error).toBeNull();
  });

  it('updates state correctly when dispatching FETCH_CONTRACTOR_TAGS_FAILURE', () => {
    const error = {
      name: 'Test Error',
      config: null,
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_CONTRACTOR_TAGS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBe(error);
  });
});
