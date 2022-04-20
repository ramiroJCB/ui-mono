import axios, { AxiosError } from 'axios';
import { IExpandedMandate } from 'interfaces/mandate';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const $top = 25;

type ResponseData = { value: IExpandedMandate[]; '@odata.count': number };

const fetchMandatesRequest = () =>
  ({
    type: 'FETCH_MANDATES_REQUEST'
  } as const);

const fetchMandatesSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_MANDATES_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchMandatesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_MANDATES_FAILURE',
    error
  } as const;
};

export const fetchMandates = (
  clientId: string,
  page: number
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchMandatesRequest());

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramMandates', {
        params: {
          $top,
          $skip: page * $top,
          $orderby: 'SafetyProgramTitle',
          $expand: 'BusinessUnits,Client,RegionalServices,SafetyProgram',
          $filter: `clientId eq ${clientId}`
        }
      });

      dispatch(fetchMandatesSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchMandatesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchMandatesRequest>
  | ReturnType<typeof fetchMandatesSuccess>
  | ReturnType<typeof fetchMandatesFailure>;
