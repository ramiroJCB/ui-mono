import axios, { AxiosError } from 'axios';
import { fetchClientIncidentWorkGroups } from '../../clientWorkGroups/actions/fetchClientIncidentWorkGroups';
import { IIncidentWorkGroup } from 'interfaces/incidentWorkGroup';
import { reset } from 'redux-form';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addClientIncidentWorkGroupRequest = () =>
  ({
    type: 'ADD_CLIENT_INCIDENT_WORKGROUP_REQUEST'
  } as const);

const addClientIncidentWorkGroupSuccess = (payload: IIncidentWorkGroup) =>
  ({
    type: 'ADD_CLIENT_INCIDENT_WORKGROUP_SUCCESS',
    payload
  } as const);

const addClientIncidentWorkGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_CLIENT_INCIDENT_WORKGROUP_FAILURE',
    error
  } as const;
};

export const addClientIncidentWorkGroup = (
  incidentWorkGroup: IIncidentWorkGroup,
  organizationId: string,
  showInactiveWorkGroups: boolean
): ThunkAction<Promise<IIncidentWorkGroup>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const clientWorkGroup: IIncidentWorkGroup = { ...incidentWorkGroup, clientId: organizationId };

      dispatch(addClientIncidentWorkGroupRequest());

      const { data } = await axios.post<IIncidentWorkGroup>('/api/v3.01/incidentWorkGroups', clientWorkGroup);

      dispatch(addClientIncidentWorkGroupSuccess(data));
      dispatch(reset('clientWorkGroupForm'));

      // Fetch workgroups again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentWorkGroups(organizationId, showInactiveWorkGroups));

      resolve(data);
    } catch (error) {
      dispatch(addClientIncidentWorkGroupFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addClientIncidentWorkGroupRequest>
  | ReturnType<typeof addClientIncidentWorkGroupSuccess>
  | ReturnType<typeof addClientIncidentWorkGroupFailure>;
