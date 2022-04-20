import axios, { AxiosError } from 'axios';
import { IIncidentRootCause, IncidentRootCauseStatus } from 'interfaces/incidentRootCause';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentRootCausesRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_ROOT_CAUSES_REQUEST'
  } as const);

const fetchClientIncidentRootCausesSuccess = (payload: IIncidentRootCause[], clientId: string) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_ROOT_CAUSES_SUCCESS',
    payload,
    clientId
  } as const);

const fetchClientIncidentRootCausesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_ROOT_CAUSES_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentRootCauses = (
  { clientIncidentRootCauses: { isFetching, incidentRootCauses, clientId: prevClientId } }: RootState,
  clientId: string
) => !isFetching && (!incidentRootCauses || (prevClientId && prevClientId !== clientId));

export const fetchClientIncidentRootCauses = (
  clientId: string,
  showInactive?: boolean
): ThunkAction<Promise<IIncidentRootCause[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentRootCausesRequest());

      const {
        data: { value }
      } = await axios.get<{ value: IIncidentRootCause[] }>('/api/v3.01/incidentRootCauses', {
        params: {
          $orderby: 'name',
          $filter: showInactive
            ? `(clientId eq ${clientId})`
            : `(clientId eq ${clientId}) and (status eq '${IncidentRootCauseStatus.Active}')`
        }
      });

      dispatch(fetchClientIncidentRootCausesSuccess(value, clientId));
      resolve(value);
    } catch (error) {
      dispatch(fetchClientIncidentRootCausesFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentRootCausesIfNeeded = (
  clientId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentRootCauses(getState(), clientId)) {
    dispatch(fetchClientIncidentRootCauses(clientId, getState().options.showInactiveRootCauses));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentRootCausesRequest>
  | ReturnType<typeof fetchClientIncidentRootCausesSuccess>
  | ReturnType<typeof fetchClientIncidentRootCausesFailure>;
