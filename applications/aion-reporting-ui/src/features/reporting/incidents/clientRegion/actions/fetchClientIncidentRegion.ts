import axios, { AxiosError } from 'axios';
import { IIncidentRegion } from 'interfaces/incidentRegion';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentRegionRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_REGION_REQUEST'
  } as const);

const fetchClientIncidentRegionSuccess = (payload: IIncidentRegion) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_REGION_SUCCESS',
    payload
  } as const);

const fetchClientIncidentRegionFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_REGION_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentRegion = (
  { clientIncidentRegion: { isFetching, incidentRegion } }: RootState,
  incidentRegionId: string
) => !isFetching && (!incidentRegion || incidentRegion.id !== incidentRegionId);

const fetchClientIncidentRegion = (
  incidentRegionId: string
): ThunkAction<Promise<IIncidentRegion>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentRegionRequest());

      const { data } = await axios.get<IIncidentRegion>(`/api/v3.01/incidentRegions(${incidentRegionId})`);

      dispatch(fetchClientIncidentRegionSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchClientIncidentRegionFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentRegionIfNeeded = (
  incidentRegionId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentRegion(getState(), incidentRegionId)) {
    dispatch(fetchClientIncidentRegion(incidentRegionId));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentRegionRequest>
  | ReturnType<typeof fetchClientIncidentRegionSuccess>
  | ReturnType<typeof fetchClientIncidentRegionFailure>;
