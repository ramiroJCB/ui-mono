import { Actions as AddTradeNameActions } from './actions/addTradeName';
import { Actions as DeleteTradeNameActions } from './actions/deleteTradeName';
import { Actions as EditTradeNameActions } from './actions/editTradeName';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ITradeName } from 'interfaces/tradeName';

export type State = DeepReadonly<{
  isFetching: boolean;
  tradeName: ITradeName | null;
  error: AxiosError | null;
}>;

type Actions = AddTradeNameActions | EditTradeNameActions | DeleteTradeNameActions;

export const initialState: State = {
  isFetching: false,
  tradeName: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_TRADE_NAME_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_TRADE_NAME_SUCCESS':
    case 'EDIT_TRADE_NAME_SUCCESS':
      return {
        isFetching: false,
        tradeName: action.payload,
        error: null
      };
    case 'DELETE_TRADE_NAME_SUCCESS':
      return {
        isFetching: false,
        tradeName: null,
        error: null
      };
    case 'ADD_TRADE_NAME_FAILURE':
    case 'EDIT_TRADE_NAME_FAILURE':
    case 'DELETE_TRADE_NAME_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
