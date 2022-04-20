import axios, { AxiosError } from 'axios';
import { IExpandedMandate } from 'interfaces/mandate';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchMandateRequest = () =>
  ({
    type: 'FETCH_MANDATE_REQUEST'
  } as const);

const fetchMandateSuccess = (payload: IExpandedMandate) =>
  ({
    type: 'FETCH_MANDATE_SUCCESS',
    payload
  } as const);

const fetchMandateFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_MANDATE_FAILURE',
    error
  } as const;
};

export const fetchMandate = (
  id: string
): ThunkAction<Promise<IExpandedMandate>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchMandateRequest());

      const { data } = await axios.get<IExpandedMandate>(`/api/v3.01/safetyProgramMandates(${id})`, {
        params: {
          $expand: 'BusinessUnits,Client,RegionalServices,SafetyProgram'
        }
      });

      dispatch(fetchMandateSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchMandateFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchMandateRequest>
  | ReturnType<typeof fetchMandateSuccess>
  | ReturnType<typeof fetchMandateFailure>;
