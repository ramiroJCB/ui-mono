import { AxiosError } from 'axios';
import { fetchAll } from '@pec/aion-ui-odata/helpers/fetchAll';
import { IBusinessUnit } from 'interfaces/businessUnit';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchBusinessUnitsRequest = () =>
  ({
    type: 'FETCH_BUSINESS_UNITS_REQUEST'
  } as const);

const fetchBusinessUnitsSuccess = (payload: IBusinessUnit[]) =>
  ({
    type: 'FETCH_BUSINESS_UNITS_SUCCESS',
    payload
  } as const);

const fetchBusinessUnitsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_BUSINESS_UNITS_FAILURE',
    error
  } as const;
};

export const fetchBusinessUnits = (
  clientId: string
): ThunkAction<Promise<IBusinessUnit[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchBusinessUnitsRequest());

      const data = await fetchAll<IBusinessUnit>('/api/v3.01/safetyProgramBusinessUnits', {
        params: {
          $filter: `clientId eq ${clientId}`
        }
      });

      dispatch(fetchBusinessUnitsSuccess(data.value));
      resolve(data.value);
    } catch (error) {
      dispatch(fetchBusinessUnitsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchBusinessUnitsRequest>
  | ReturnType<typeof fetchBusinessUnitsSuccess>
  | ReturnType<typeof fetchBusinessUnitsFailure>;
