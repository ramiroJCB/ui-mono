import { AxiosError } from 'axios';
import { fetchAll } from '@pec/aion-ui-odata/helpers/fetchAll';
import { IRegionalService } from 'interfaces/regionalService';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRegionalServicesRequest = () =>
  ({
    type: 'FETCH_REGIONAL_SERVICES_REQUEST'
  } as const);

const fetchRegionalServicesSuccess = (payload: IRegionalService[]) =>
  ({
    type: 'FETCH_REGIONAL_SERVICES_SUCCESS',
    payload
  } as const);

const fetchRegionalServicesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONAL_SERVICES_FAILURE',
    error
  } as const;
};

export const fetchRegionalServices = (
  serviceRegionId: string
): ThunkAction<Promise<IRegionalService[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionalServicesRequest());

      const data = await fetchAll<IRegionalService>('/api/v3.01/safetyProgramRegionalServices', {
        params: {
          $filter: `serviceRegionId eq ${serviceRegionId}`,
          $orderby: 'serviceName',
          $top: 1000
        }
      });

      dispatch(fetchRegionalServicesSuccess(data.value));
      resolve(data.value);
    } catch (error) {
      dispatch(fetchRegionalServicesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchRegionalServicesRequest>
  | ReturnType<typeof fetchRegionalServicesSuccess>
  | ReturnType<typeof fetchRegionalServicesFailure>;
