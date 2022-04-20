import axios, { AxiosError } from 'axios';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ITradeName } from 'interfaces/tradeName';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const editTradeNameRequest = () =>
  ({
    type: 'EDIT_TRADE_NAME_REQUEST'
  } as const);

export const editTradeNameSuccess = (payload: ITradeName) =>
  ({
    type: 'EDIT_TRADE_NAME_SUCCESS',
    payload
  } as const);

export const editTradeNameFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_TRADE_NAME_FAILURE',
    error
  } as const;
};

export const editTradeName = (
  organizationId: string,
  values: ITradeName
): ThunkAction<Promise<ITradeName>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editTradeNameRequest());

      const { data } = await axios.put<ITradeName>(
        `/api/v3.01/organizations(${organizationId})/tradeNames(${values.id})`,
        values
      );

      dispatch(editTradeNameSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editTradeNameFailure(error));
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
  | ReturnType<typeof editTradeNameRequest>
  | ReturnType<typeof editTradeNameSuccess>
  | ReturnType<typeof editTradeNameFailure>;
