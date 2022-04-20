import axios, { AxiosError } from 'axios';
import { fetchClientIncidentRootCauses } from '../../clientRootCauses/actions/fetchClientIncidentRootCauses';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateClientIncidentRootCauseRequest = () =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_ROOT_CAUSE_REQUEST'
  } as const);

const updateClientIncidentRootCauseSuccess = (payload: IIncidentRootCause) =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_ROOT_CAUSE_SUCCESS',
    payload
  } as const);

const updateClientIncidentRootCauseFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_CLIENT_INCIDENT_ROOT_CAUSE_FAILURE',
    error
  } as const;
};

export const updateClientIncidentRootCause = (
  clientRootCause: IIncidentRootCause,
  organizationId: string,
  showInactiveRootCauses: boolean
): ThunkAction<Promise<IIncidentRootCause>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateClientIncidentRootCauseRequest());

      const { data } = await axios.put<IIncidentRootCause>(
        `/api/v3.01/incidentRootCauses(${clientRootCause.id})`,
        clientRootCause
      );

      dispatch(updateClientIncidentRootCauseSuccess(data));

      // Fetch root causes again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentRootCauses(organizationId, showInactiveRootCauses));

      resolve(data);
    } catch (error) {
      dispatch(updateClientIncidentRootCauseFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateClientIncidentRootCauseRequest>
  | ReturnType<typeof updateClientIncidentRootCauseSuccess>
  | ReturnType<typeof updateClientIncidentRootCauseFailure>;
