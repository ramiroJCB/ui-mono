import axios, { AxiosError } from 'axios';
import { IIncidentRegion, IncidentRegionStatus } from 'interfaces/incidentRegion';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentRegionsRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_REGIONS_REQUEST'
  } as const);

const fetchClientIncidentRegionsSuccess = (payload: IIncidentRegion[], clientId: string) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_REGIONS_SUCCESS',
    payload,
    clientId
  } as const);

const fetchClientIncidentRegionsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_REGIONS_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentRegions = (
  { clientIncidentRegions: { isFetching, incidentRegions, clientId: prevClientId } }: RootState,
  clientId: string
) => !isFetching && (!incidentRegions || (prevClientId && prevClientId !== clientId));

export const fetchClientIncidentRegions = (
  clientId: string,
  showInactive?: boolean
): ThunkAction<Promise<IIncidentRegion[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentRegionsRequest());

      const {
        data: { value }
      } = await axios.get<{ value: IIncidentRegion[] }>('/api/v3.01/incidentRegions', {
        params: {
          $orderby: 'name',
          $filter: showInactive
            ? `(clientId eq ${clientId})`
            : `(clientId eq ${clientId}) and (status eq '${IncidentRegionStatus.Active}')`
        }
      });

      dispatch(fetchClientIncidentRegionsSuccess(value, clientId));
      resolve(value);
    } catch (error) {
      dispatch(fetchClientIncidentRegionsFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentRegionsIfNeeded = (
  clientId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentRegions(getState(), clientId)) {
    dispatch(fetchClientIncidentRegions(clientId, getState().options.showInactiveRegions));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentRegionsRequest>
  | ReturnType<typeof fetchClientIncidentRegionsSuccess>
  | ReturnType<typeof fetchClientIncidentRegionsFailure>;
