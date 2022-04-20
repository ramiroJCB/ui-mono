import axios, { AxiosError } from 'axios';
import { fetchClientIncidentRegions } from '../../clientRegions/actions/fetchClientIncidentRegions';
import { IIncidentRegion } from 'interfaces/incidentRegion';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateClientIncidentRegionRequest = () =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_REGION_REQUEST'
  } as const);

const updateClientIncidentRegionSuccess = (payload: IIncidentRegion) =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_REGION_SUCCESS',
    payload
  } as const);

const updateClientIncidentRegionFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_CLIENT_INCIDENT_REGION_FAILURE',
    error
  } as const;
};

export const updateClientIncidentRegion = (
  clientRegion: IIncidentRegion,
  organizationId: string,
  showInactiveRegions: boolean
): ThunkAction<Promise<IIncidentRegion>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateClientIncidentRegionRequest());

      const { data } = await axios.put<IIncidentRegion>(`/api/v3.01/incidentRegions(${clientRegion.id})`, clientRegion);

      dispatch(updateClientIncidentRegionSuccess(data));

      // Fetch regions again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentRegions(organizationId, showInactiveRegions));

      resolve(data);
    } catch (error) {
      dispatch(updateClientIncidentRegionFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateClientIncidentRegionRequest>
  | ReturnType<typeof updateClientIncidentRegionSuccess>
  | ReturnType<typeof updateClientIncidentRegionFailure>;
