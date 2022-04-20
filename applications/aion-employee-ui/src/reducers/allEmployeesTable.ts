import * as actionTypes from '../actionTypes';
import { RootActions } from 'combineActions';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';
import { AxiosError } from 'axios';

export type IAllEmployeesRow = {
  data: IVerisourceEmployee | null;
  isFetching: boolean;
  error: AxiosError | null;
};

export type State = {
  readonly rowsData: {
    [pecId: string]: IAllEmployeesRow;
  };
  readonly expandedRows: string[];
};

export const initialState: State = {
  rowsData: {},
  expandedRows: []
};

export function reducer(state: State = initialState, action: RootActions): State {
  switch (action.type) {
    case actionTypes.TOGGLE_EXPANDED_ROW:
      return {
        ...state,
        expandedRows: state.expandedRows.includes(action.payload)
          ? state.expandedRows.filter(r => r !== action.payload)
          : [...state.expandedRows, action.payload]
      };

    case actionTypes.FETCH_VERISOURCE_EMPLOYEE_REQUEST:
      return {
        ...state,
        rowsData: {
          ...state.rowsData,
          [action.payload.PECId]: {
            data: null,
            isFetching: true,
            error: null
          }
        }
      };

    case actionTypes.FETCH_VERISOURCE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        rowsData: {
          ...state.rowsData,
          [action.payload.PECId]: {
            data: action.payload.employee,
            isFetching: false,
            error: null
          }
        }
      };

    case actionTypes.FETCH_VERISOURCE_EMPLOYEE_FAILURE:
      return {
        ...state,
        rowsData: {
          ...state.rowsData,
          [action.payload.PECId]: {
            data: null,
            isFetching: false,
            error: action.payload.error
          }
        }
      };

    default:
      return state;
  }
}
