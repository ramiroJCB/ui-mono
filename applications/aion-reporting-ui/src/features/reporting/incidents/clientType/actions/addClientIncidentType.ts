import axios, { AxiosError } from 'axios';
import { fetchClientIncidentTypes } from '../../clientTypes/actions/fetchClientIncidentTypes';
import { IIncidentType } from 'interfaces/incidentType';
import { reset } from 'redux-form';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addClientIncidentTypeRequest = () =>
  ({
    type: 'ADD_CLIENT_INCIDENT_TYPE_REQUEST'
  } as const);

const addClientIncidentTypeSuccess = (payload: IIncidentType) =>
  ({
    type: 'ADD_CLIENT_INCIDENT_TYPE_SUCCESS',
    payload
  } as const);

const addClientIncidentTypeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_CLIENT_INCIDENT_TYPE_FAILURE',
    error
  } as const;
};

export const addClientIncidentType = (
  incidentType: IIncidentType,
  organizationId: string,
  showInactiveTypes: boolean
): ThunkAction<Promise<IIncidentType>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const clientType: IIncidentType = { ...incidentType, clientId: organizationId };

      dispatch(addClientIncidentTypeRequest());

      const { data } = await axios.post<IIncidentType>('/api/v3.01/incidentTypes', clientType);

      dispatch(addClientIncidentTypeSuccess(data));
      dispatch(reset('clientTypeForm'));

      // Fetch types again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentTypes(organizationId, showInactiveTypes));

      resolve(data);
    } catch (error) {
      dispatch(addClientIncidentTypeFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addClientIncidentTypeRequest>
  | ReturnType<typeof addClientIncidentTypeSuccess>
  | ReturnType<typeof addClientIncidentTypeFailure>;
