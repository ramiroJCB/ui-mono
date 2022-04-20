import { AxiosError } from 'axios';
import { fetchAll } from '@pec/aion-ui-odata/helpers/fetchAll';
import { IClientServiceRegion } from 'interfaces/clientServiceRegion';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientServiceRegionsRequest = () =>
  ({
    type: 'FETCH_CLIENT_SERVICE_REGIONS_REQUEST'
  } as const);

const fetchClientServiceRegionsSuccess = (payload: IClientServiceRegion[]) =>
  ({
    type: 'FETCH_CLIENT_SERVICE_REGIONS_SUCCESS',
    payload
  } as const);

const fetchClientServiceRegionsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_SERVICE_REGIONS_FAILURE',
    error
  } as const;
};

export const fetchClientServiceRegions = (
  clientId: string
): ThunkAction<Promise<IClientServiceRegion[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientServiceRegionsRequest());

      const data = await fetchAll<IClientServiceRegion>('/api/v3.01/safetyProgramClientServiceRegions', {
        params: {
          $filter: `clientId eq ${clientId}`,
          $orderby: 'serviceRegionName'
        }
      });

      dispatch(fetchClientServiceRegionsSuccess(data.value));
      resolve(data.value);
    } catch (error) {
      dispatch(fetchClientServiceRegionsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchClientServiceRegionsRequest>
  | ReturnType<typeof fetchClientServiceRegionsSuccess>
  | ReturnType<typeof fetchClientServiceRegionsFailure>;
