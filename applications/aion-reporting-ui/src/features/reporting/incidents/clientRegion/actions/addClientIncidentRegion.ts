import axios, { AxiosError } from 'axios';
import { fetchClientIncidentRegions } from '../../clientRegions/actions/fetchClientIncidentRegions';
import { IIncidentRegion } from 'interfaces/incidentRegion';
import { reset } from 'redux-form';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addClientIncidentRegionRequest = () =>
  ({
    type: 'ADD_CLIENT_INCIDENT_REGION_REQUEST'
  } as const);

const addClientIncidentRegionSuccess = (payload: IIncidentRegion) =>
  ({
    type: 'ADD_CLIENT_INCIDENT_REGION_SUCCESS',
    payload
  } as const);

const addClientIncidentRegionFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_CLIENT_INCIDENT_REGION_FAILURE',
    error
  } as const;
};

export const addClientIncidentRegion = (
  incidentRegion: IIncidentRegion,
  organizationId: string,
  showInactiveRegions: boolean
): ThunkAction<Promise<IIncidentRegion>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const clientRegion: IIncidentRegion = { ...incidentRegion, clientId: organizationId };

      dispatch(addClientIncidentRegionRequest());

      const { data } = await axios.post<IIncidentRegion>('/api/v3.01/incidentRegions', clientRegion);

      dispatch(addClientIncidentRegionSuccess(data));
      dispatch(reset('clientRegionForm'));

      // Fetch regions again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentRegions(organizationId, showInactiveRegions));

      resolve(data);
    } catch (error) {
      dispatch(addClientIncidentRegionFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addClientIncidentRegionRequest>
  | ReturnType<typeof addClientIncidentRegionSuccess>
  | ReturnType<typeof addClientIncidentRegionFailure>;
