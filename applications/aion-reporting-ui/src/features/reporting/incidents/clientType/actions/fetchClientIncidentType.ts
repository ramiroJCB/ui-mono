import axios, { AxiosError } from 'axios';
import { IIncidentType } from 'interfaces/incidentType';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentTypeRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_TYPE_REQUEST'
  } as const);

const fetchClientIncidentTypeSuccess = (payload: IIncidentType) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_TYPE_SUCCESS',
    payload
  } as const);

const fetchClientIncidentTypeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_TYPE_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentType = (
  { clientIncidentType: { isFetching, incidentType } }: RootState,
  incidentTypeId: string
) => !isFetching && (!incidentType || incidentType.id !== incidentTypeId);

const fetchClientIncidentType = (
  incidentTypeId: string
): ThunkAction<Promise<IIncidentType>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentTypeRequest());

      const { data } = await axios.get<IIncidentType>(`/api/v3.01/incidentTypes(${incidentTypeId})`);

      dispatch(fetchClientIncidentTypeSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchClientIncidentTypeFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentTypeIfNeeded = (
  incidentTypeId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentType(getState(), incidentTypeId)) {
    dispatch(fetchClientIncidentType(incidentTypeId));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentTypeRequest>
  | ReturnType<typeof fetchClientIncidentTypeSuccess>
  | ReturnType<typeof fetchClientIncidentTypeFailure>;
