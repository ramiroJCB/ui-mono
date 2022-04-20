import axios, { AxiosError } from 'axios';
import { fetchClientIncidentWorkGroups } from '../../clientWorkGroups/actions/fetchClientIncidentWorkGroups';
import { IIncidentWorkGroup } from 'interfaces/incidentWorkGroup';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateClientIncidentWorkGroupRequest = () =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_WORKGROUP_REQUEST'
  } as const);

const updateClientIncidentWorkGroupSuccess = (payload: IIncidentWorkGroup) =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_WORKGROUP_SUCCESS',
    payload
  } as const);

const updateClientIncidentWorkGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_CLIENT_INCIDENT_WORKGROUP_FAILURE',
    error
  } as const;
};

export const updateClientIncidentWorkGroup = (
  clientWorkGroup: IIncidentWorkGroup,
  organizationId: string,
  showInactiveWorkGroups: boolean
): ThunkAction<Promise<IIncidentWorkGroup>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateClientIncidentWorkGroupRequest());

      const { data } = await axios.put<IIncidentWorkGroup>(
        `/api/v3.01/incidentWorkGroups(${clientWorkGroup.id})`,
        clientWorkGroup
      );

      dispatch(updateClientIncidentWorkGroupSuccess(data));

      // Fetch workgroups again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentWorkGroups(organizationId, showInactiveWorkGroups));

      resolve(data);
    } catch (error) {
      dispatch(updateClientIncidentWorkGroupFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateClientIncidentWorkGroupRequest>
  | ReturnType<typeof updateClientIncidentWorkGroupSuccess>
  | ReturnType<typeof updateClientIncidentWorkGroupFailure>;
