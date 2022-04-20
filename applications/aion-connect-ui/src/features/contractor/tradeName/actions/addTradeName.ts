import axios, { AxiosError } from 'axios';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ITradeName } from 'interfaces/tradeName';
import { ITradeNameForm } from 'interfaces/tradeNameForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addTradeNameRequest = () =>
  ({
    type: 'ADD_TRADE_NAME_REQUEST'
  } as const);

export const addTradeNameSuccess = (payload: ITradeName) =>
  ({
    type: 'ADD_TRADE_NAME_SUCCESS',
    payload
  } as const);

export const addTradeNameFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_TRADE_NAME_FAILURE',
    error
  } as const;
};

export const addTradeName = (
  organizationId: string,
  values: ITradeNameForm
): ThunkAction<Promise<ITradeName>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addTradeNameRequest());

      const { data } = await axios.post<ITradeName>(`/api/v3.01/organizations(${organizationId})/tradeNames`, values);

      dispatch(addTradeNameSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addTradeNameFailure(error));
      dispatch(
        enqueueSnackbar({
          message: 'There was an error processing your request.',
          options: {
            variant: 'error'
          }
        })
      );
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addTradeNameRequest>
  | ReturnType<typeof addTradeNameSuccess>
  | ReturnType<typeof addTradeNameFailure>;
