import axios, { AxiosError } from 'axios';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteTradeNameRequest = () =>
  ({
    type: 'DELETE_TRADE_NAME_REQUEST'
  } as const);

export const deleteTradeNameSuccess = (payload: string) =>
  ({
    type: 'DELETE_TRADE_NAME_SUCCESS',
    payload
  } as const);

export const deleteTradeNameFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_TRADE_NAME_FAILURE',
    error
  } as const;
};

export const deleteTradeName = (
  organizationId: string,
  tradeNameId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteTradeNameRequest());

      await axios.delete(`/api/v3.01/organizations(${organizationId})/tradeNames(${tradeNameId})`);

      resolve();
    } catch (error) {
      dispatch(deleteTradeNameFailure(error));
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
  | ReturnType<typeof deleteTradeNameRequest>
  | ReturnType<typeof deleteTradeNameSuccess>
  | ReturnType<typeof deleteTradeNameFailure>;
