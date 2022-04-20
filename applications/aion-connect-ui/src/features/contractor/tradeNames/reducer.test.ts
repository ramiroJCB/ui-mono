import { error, tradeNames } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';
import { ITradeName } from 'interfaces/tradeName';

let prevState: State;
const tradeName = tradeNames[0];

beforeEach(() => {
  prevState = initialState;
});

describe('trade names reducer', () => {
  it('should update state correctly when dispatching FETCH_TRADE_NAMES_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TRADE_NAMES_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_TRADE_NAMES_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TRADE_NAMES_SUCCESS',
      payload: tradeNames
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.tradeNames).toEqual(tradeNames);
  });

  it('should update state correctly when dispatching ADD_TRADE_NAME_SUCCESS', () => {
    const newTradeName: ITradeName = {
      id: '0f3dc93c-75f7-444b-9670-0985ff17be8f',
      name: 'Initech Technology Solutions',
      description:
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
      isDeleted: false
    };

    const nextState = reducer(prevState, {
      type: 'ADD_TRADE_NAME_SUCCESS',
      payload: newTradeName
    });

    expect(nextState.tradeNames).toEqual(
      [newTradeName, ...prevState.tradeNames].sort((a, b) => a.name.localeCompare(b.name))
    );
  });

  it('should update state correctly when dispatching EDIT_TRADE_NAME_SUCCESS', () => {
    const editedTradeName: ITradeName = { ...tradeName, name: 'Initech Technology' };

    prevState = reducer(prevState, {
      type: 'FETCH_TRADE_NAMES_SUCCESS',
      payload: tradeNames
    });

    const nextState = reducer(prevState, {
      type: 'EDIT_TRADE_NAME_SUCCESS',
      payload: editedTradeName
    });

    expect(nextState.tradeNames).toEqual(
      prevState.tradeNames.map(tradeName => (tradeName.id === editedTradeName.id ? editedTradeName : tradeName))
    );
  });

  it('should update state correctly when dispatching DELETE_TRADE_NAME_SUCCESS', () => {
    prevState = reducer(prevState, {
      type: 'FETCH_TRADE_NAMES_SUCCESS',
      payload: tradeNames
    });

    const nextState = reducer(prevState, {
      type: 'DELETE_TRADE_NAME_SUCCESS',
      payload: tradeName.id
    });

    expect(nextState.tradeNames).toEqual(tradeNames.filter(({ id }) => id !== tradeName.id));
  });

  it('should update state correctly when dispatching FETCH_TRADE_NAMES_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TRADE_NAMES_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
