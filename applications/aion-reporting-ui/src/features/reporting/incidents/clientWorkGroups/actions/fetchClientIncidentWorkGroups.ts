import axios, { AxiosError } from 'axios';
import { IIncidentWorkGroup, IncidentWorkGroupStatus } from 'interfaces/incidentWorkGroup';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentWorkGroupsRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_WORKGROUPS_REQUEST'
  } as const);

const fetchClientIncidentWorkGroupsSuccess = (payload: IIncidentWorkGroup[], clientId: string) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_WORKGROUPS_SUCCESS',
    payload,
    clientId
  } as const);

const fetchClientIncidentWorkGroupsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_WORKGROUPS_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentWorkGroups = (
  { clientIncidentWorkGroups: { isFetching, incidentWorkGroups, clientId: prevClientId } }: RootState,
  clientId: string
) => !isFetching && (!incidentWorkGroups || (prevClientId && prevClientId !== clientId));

export const fetchClientIncidentWorkGroups = (
  clientId: string,
  showInactive?: boolean
): ThunkAction<Promise<IIncidentWorkGroup[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentWorkGroupsRequest());

      const {
        data: { value }
      } = await axios.get<{ value: IIncidentWorkGroup[] }>('/api/v3.01/incidentWorkGroups', {
        params: {
          $orderby: 'name',
          $filter: showInactive
            ? `(clientId eq ${clientId})`
            : `(clientId eq ${clientId}) and (status eq '${IncidentWorkGroupStatus.Active}')`
        }
      });

      dispatch(fetchClientIncidentWorkGroupsSuccess(value, clientId));
      resolve(value);
    } catch (error) {
      dispatch(fetchClientIncidentWorkGroupsFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentWorkGroupsIfNeeded = (
  clientId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentWorkGroups(getState(), clientId)) {
    dispatch(fetchClientIncidentWorkGroups(clientId, getState().options.showInactiveWorkGroups));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentWorkGroupsRequest>
  | ReturnType<typeof fetchClientIncidentWorkGroupsSuccess>
  | ReturnType<typeof fetchClientIncidentWorkGroupsFailure>;
