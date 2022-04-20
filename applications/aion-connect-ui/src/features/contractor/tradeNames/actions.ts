import axios, { AxiosError } from 'axios';
import { ITradeName } from 'interfaces/tradeName';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTradeNamesRequest = () =>
  ({
    type: 'FETCH_TRADE_NAMES_REQUEST'
  } as const);

const fetchTradeNamesSuccess = (payload: ITradeName[]) =>
  ({
    type: 'FETCH_TRADE_NAMES_SUCCESS',
    payload
  } as const);

const fetchTradeNamesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TRADE_NAMES_FAILURE',
    error
  } as const;
};

export const fetchTradeNames = (
  organizationId: string
): ThunkAction<Promise<ITradeName[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchTradeNamesRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .orderBy('name asc')
        .filter(f => f.filterBy('isDeleted', Equals, false))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: ITradeName[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/tradeNames`,
        { params }
      );

      dispatch(fetchTradeNamesSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchTradeNamesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchTradeNamesRequest>
  | ReturnType<typeof fetchTradeNamesSuccess>
  | ReturnType<typeof fetchTradeNamesFailure>;
