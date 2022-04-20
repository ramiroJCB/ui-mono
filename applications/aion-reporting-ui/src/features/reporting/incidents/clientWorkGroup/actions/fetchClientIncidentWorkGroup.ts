import axios, { AxiosError } from 'axios';
import { IIncidentWorkGroup } from 'interfaces/incidentWorkGroup';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentWorkGroupRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_WORKGROUP_REQUEST'
  } as const);

const fetchClientIncidentWorkGroupSuccess = (payload: IIncidentWorkGroup) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_WORKGROUP_SUCCESS',
    payload
  } as const);

const fetchClientIncidentWorkGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_WORKGROUP_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentWorkGroup = (
  { clientIncidentWorkGroup: { isFetching, incidentWorkGroup } }: RootState,
  incidentWorkGroupId: string
) => !isFetching && (!incidentWorkGroup || incidentWorkGroup.id !== incidentWorkGroupId);

const fetchClientIncidentWorkGroup = (
  incidentWorkGroupId: string
): ThunkAction<Promise<IIncidentWorkGroup>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentWorkGroupRequest());

      const { data } = await axios.get<IIncidentWorkGroup>(`/api/v3.01/incidentWorkGroups(${incidentWorkGroupId})`);

      dispatch(fetchClientIncidentWorkGroupSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchClientIncidentWorkGroupFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentWorkGroupIfNeeded = (
  incidentWorkGroupId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentWorkGroup(getState(), incidentWorkGroupId)) {
    dispatch(fetchClientIncidentWorkGroup(incidentWorkGroupId));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentWorkGroupRequest>
  | ReturnType<typeof fetchClientIncidentWorkGroupSuccess>
  | ReturnType<typeof fetchClientIncidentWorkGroupFailure>;
