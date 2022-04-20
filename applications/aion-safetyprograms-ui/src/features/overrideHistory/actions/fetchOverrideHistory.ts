import axios, { AxiosError } from 'axios';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { IOverrideHistory } from 'interfaces/overrideHistory';
import { v4 as uuid } from 'uuid';

const fetchOverrideHistoryRequest = () =>
  ({
    type: 'FETCH_OVERRIDE_HISTORY_REQUEST'
  } as const);

const fetchOverrideHistorySuccess = (data: IOverrideHistory[]) =>
  ({
    type: 'FETCH_OVERRIDE_HISTORY_SUCCESS',
    payload: data,
    total: data['@odata.count']
  } as const);

const fetchOverrideHistoryFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_OVERRIDE_HISTORY_FAILURE',
    error
  } as const;
};

export const fetchOverrideHistory = (
  requirementId: string,
  clientId?: string
): ThunkAction<Promise<IOverrideHistory[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchOverrideHistoryRequest());

      const params = { requirementId, clientId };
      const { data } = await axios.get<IOverrideHistory[]>('/api/v3.01/safetyProgramOverrideHistory', {
        params
      });

      const value = data.map(history => {
        return {
          ...history,
          id: uuid()
        };
      });

      dispatch(fetchOverrideHistorySuccess(value));
      resolve(data);
    } catch (error) {
      dispatch(fetchOverrideHistoryFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchOverrideHistoryRequest>
  | ReturnType<typeof fetchOverrideHistorySuccess>
  | ReturnType<typeof fetchOverrideHistoryFailure>;
