import axios, { AxiosError } from 'axios';
import { fetchClientIncidentRootCauses } from '../../clientRootCauses/actions/fetchClientIncidentRootCauses';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';
import { reset } from 'redux-form';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addClientIncidentRootCauseRequest = () =>
  ({
    type: 'ADD_CLIENT_INCIDENT_ROOT_CAUSE_REQUEST'
  } as const);

const addClientIncidentRootCauseSuccess = (payload: IIncidentRootCause) =>
  ({
    type: 'ADD_CLIENT_INCIDENT_ROOT_CAUSE_SUCCESS',
    payload
  } as const);

const addClientIncidentRootCauseFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_CLIENT_INCIDENT_ROOT_CAUSE_FAILURE',
    error
  } as const;
};

export const addClientIncidentRootCause = (
  incidentRootCause: IIncidentRootCause,
  organizationId: string,
  showInactiveRootCauses: boolean
): ThunkAction<Promise<IIncidentRootCause>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const clientRootCause: IIncidentRootCause = { ...incidentRootCause, clientId: organizationId };

      dispatch(addClientIncidentRootCauseRequest());

      const { data } = await axios.post<IIncidentRootCause>('/api/v3.01/incidentRootCauses', clientRootCause);

      dispatch(addClientIncidentRootCauseSuccess(data));
      dispatch(reset('clientRootCauseForm'));

      // Fetch root cause again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentRootCauses(organizationId, showInactiveRootCauses));

      resolve(data);
    } catch (error) {
      dispatch(addClientIncidentRootCauseFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addClientIncidentRootCauseRequest>
  | ReturnType<typeof addClientIncidentRootCauseSuccess>
  | ReturnType<typeof addClientIncidentRootCauseFailure>;
