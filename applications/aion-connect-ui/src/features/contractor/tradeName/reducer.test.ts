import { error, tradeNames } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const tradeName = tradeNames[0];

beforeEach(() => {
  prevState = initialState;
});

describe('trade name reducer', () => {
  it('should update state correctly when dispatching ADD_TRADE_NAME_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_TRADE_NAME_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching ADD_TRADE_NAME_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_TRADE_NAME_SUCCESS',
      payload: tradeName
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.tradeName).toEqual(tradeName);
  });

  it('should update state correctly when dispatching EDIT_TRADE_NAME_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_TRADE_NAME_SUCCESS',
      payload: tradeName
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.tradeName).toEqual(tradeName);
  });

  it('should update state correctly when dispatching DELETE_TRADE_NAME_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_TRADE_NAME_SUCCESS',
      payload: tradeName.id
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.tradeName).toBeNull();
  });

  it('should update state correctly when dispatching ADD_TRADE_NAME_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_TRADE_NAME_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching EDIT_TRADE_NAME_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_TRADE_NAME_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching DELETE_TRADE_NAME_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_TRADE_NAME_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
