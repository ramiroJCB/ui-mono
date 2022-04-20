import axios, { AxiosError } from 'axios';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentRootCauseRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_ROOT_CAUSE_REQUEST'
  } as const);

const fetchClientIncidentRootCauseSuccess = (payload: IIncidentRootCause) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_ROOT_CAUSE_SUCCESS',
    payload
  } as const);

const fetchClientIncidentRootCauseFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_ROOT_CAUSE_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentRootCause = (
  { clientIncidentRootCause: { isFetching, incidentRootCause } }: RootState,
  incidentRootCauseId: string
) => !isFetching && (!incidentRootCause || incidentRootCause.id !== incidentRootCauseId);

export const fetchClientIncidentRootCause = (
  incidentRootCauseId: string
): ThunkAction<Promise<IIncidentRootCause>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentRootCauseRequest());

      const { data } = await axios.get<IIncidentRootCause>(`/api/v3.01/incidentRootCauses(${incidentRootCauseId})`);

      dispatch(fetchClientIncidentRootCauseSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchClientIncidentRootCauseFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentRootCauseIfNeeded = (
  incidentRootCauseId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentRootCause(getState(), incidentRootCauseId)) {
    dispatch(fetchClientIncidentRootCause(incidentRootCauseId));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentRootCauseRequest>
  | ReturnType<typeof fetchClientIncidentRootCauseSuccess>
  | ReturnType<typeof fetchClientIncidentRootCauseFailure>;
