import axios, { AxiosError } from 'axios';
import { IIncidentType, IncidentTypeStatus } from 'interfaces/incidentType';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentTypesRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_TYPES_REQUEST'
  } as const);

const fetchClientIncidentTypesSuccess = (payload: IIncidentType[], clientId: string) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_TYPES_SUCCESS',
    payload,
    clientId
  } as const);

const fetchClientIncidentTypesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_TYPES_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentTypes = (
  { clientIncidentTypes: { isFetching, incidentTypes, clientId: prevClientId } }: RootState,
  clientId: string
) => !isFetching && (!incidentTypes || (prevClientId && prevClientId !== clientId));

export const fetchClientIncidentTypes = (
  clientId: string,
  showInactive?: boolean
): ThunkAction<Promise<IIncidentType[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentTypesRequest());

      const {
        data: { value }
      } = await axios.get<{ value: IIncidentType[] }>('/api/v3.01/incidentTypes', {
        params: {
          $orderby: 'name',
          $filter: showInactive
            ? `(clientId eq ${clientId})`
            : `(clientId eq ${clientId}) and (status eq '${IncidentTypeStatus.Active}')`
        }
      });

      dispatch(fetchClientIncidentTypesSuccess(value, clientId));
      resolve(value);
    } catch (error) {
      dispatch(fetchClientIncidentTypesFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentTypesIfNeeded = (
  clientId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentTypes(getState(), clientId)) {
    dispatch(fetchClientIncidentTypes(clientId, getState().options.showInactiveTypes));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentTypesRequest>
  | ReturnType<typeof fetchClientIncidentTypesSuccess>
  | ReturnType<typeof fetchClientIncidentTypesFailure>;
