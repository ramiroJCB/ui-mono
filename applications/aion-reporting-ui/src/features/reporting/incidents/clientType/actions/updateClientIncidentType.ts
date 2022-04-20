import axios, { AxiosError } from 'axios';
import { fetchClientIncidentTypes } from '../../clientTypes/actions/fetchClientIncidentTypes';
import { IIncidentType } from 'interfaces/incidentType';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateClientIncidentTypeRequest = () =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_TYPE_REQUEST'
  } as const);

const updateClientIncidentTypeSuccess = (payload: IIncidentType) =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_TYPE_SUCCESS',
    payload
  } as const);

const updateClientIncidentTypeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_CLIENT_INCIDENT_TYPE_FAILURE',
    error
  } as const;
};

export const updateClientIncidentType = (
  clientType: IIncidentType,
  organizationId: string,
  showInactiveTypes: boolean
): ThunkAction<Promise<IIncidentType>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateClientIncidentTypeRequest());

      const { data } = await axios.put<IIncidentType>(`/api/v3.01/incidentTypes(${clientType.id})`, clientType);

      dispatch(updateClientIncidentTypeSuccess(data));

      // Fetch types again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentTypes(organizationId, showInactiveTypes));

      resolve(data);
    } catch (error) {
      dispatch(updateClientIncidentTypeFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateClientIncidentTypeRequest>
  | ReturnType<typeof updateClientIncidentTypeSuccess>
  | ReturnType<typeof updateClientIncidentTypeFailure>;
