import axios, { AxiosError } from 'axios';
import { IClient } from 'interfaces/client';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientRequest = () =>
  ({
    type: 'FETCH_SAFETY_PROGRAM_CLIENT_REQUEST'
  } as const);

const fetchClientSuccess = (payload: IClient) =>
  ({
    type: 'FETCH_SAFETY_PROGRAM_CLIENT_SUCCESS',
    payload
  } as const);

const fetchClientFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SAFETY_PROGRAM_CLIENT_FAILURE',
    error
  } as const;
};

export const fetchClient = (id: string): ThunkAction<Promise<IClient>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientRequest());

      const { data } = await axios.get<IClient>(`/api/v3.01/safetyProgramClients(${id})`);

      dispatch(fetchClientSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchClientFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchClientRequest>
  | ReturnType<typeof fetchClientSuccess>
  | ReturnType<typeof fetchClientFailure>;
