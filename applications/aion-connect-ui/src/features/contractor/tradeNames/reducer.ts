import { Actions as FetchTradeNamesActions } from './actions';
import { Actions as AddTradeNameActions } from '../tradeName/actions/addTradeName';
import { Actions as DeleteTradeNameActions } from '../tradeName/actions/deleteTradeName';
import { Actions as EditTradeNameActions } from '../tradeName/actions/editTradeName';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ITradeName } from 'interfaces/tradeName';

export type State = DeepReadonly<{
  isFetching: boolean;
  tradeNames: ITradeName[];
  error: AxiosError | null;
}>;

type Actions = FetchTradeNamesActions | AddTradeNameActions | EditTradeNameActions | DeleteTradeNameActions;

export const initialState: State = {
  isFetching: false,
  tradeNames: [],
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TRADE_NAMES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_TRADE_NAMES_SUCCESS':
      return {
        isFetching: false,
        tradeNames: action.payload,
        error: null
      };
    case 'ADD_TRADE_NAME_SUCCESS':
      return {
        ...state,
        tradeNames: [action.payload, ...state.tradeNames].sort((a, b) => a.name.localeCompare(b.name))
      };
    case 'EDIT_TRADE_NAME_SUCCESS':
      return {
        ...state,
        tradeNames: state.tradeNames.map(tradeName => (tradeName.id === action.payload.id ? action.payload : tradeName))
      };
    case 'DELETE_TRADE_NAME_SUCCESS':
      return {
        ...state,
        tradeNames: state.tradeNames.filter(({ id }) => id !== action.payload)
      };
    case 'FETCH_TRADE_NAMES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
