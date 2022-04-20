import axios, { AxiosError } from 'axios';
import { IIncident } from 'interfaces/incident';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchIncidentsByContractorRequest = () =>
  ({
    type: 'FETCH_INCIDENTS_REQUEST'
  } as const);

const fetchIncidentsByContractorSuccess = (payload: IIncident[], totalCount: number) =>
  ({
    type: 'FETCH_INCIDENTS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchIncidentsByContractorFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_INCIDENTS_FAILURE',
    error
  } as const;
};

const shouldFetchIncidentsByContractor = ({ incidents: { isFetching } }: RootState) => !isFetching;

export const fetchIncidentsByContractor = (
  contractorId: string
): ThunkAction<Promise<IIncident[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchIncidentsByContractorRequest());

      const response = await axios.get<{ value: IIncident[] }>('/api/v3.01/incidents', {
        params: {
          includeMetadata: true,
          $filter: `contractorId eq ${contractorId}`,
          $orderBy: 'occurredOnDateUtc desc'
        }
      });

      const incidents = response.data.value || response.data; // API || json-server
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchIncidentsByContractorSuccess(incidents, totalCount));
      resolve(incidents);
    } catch (error) {
      dispatch(fetchIncidentsByContractorFailure(error));
      reject(error);
    }
  });
};

export const fetchIncidentsByContractorIfNeeded = (
  contractorId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchIncidentsByContractor(getState())) {
    dispatch(fetchIncidentsByContractor(contractorId));
  }
};

export type Actions =
  | ReturnType<typeof fetchIncidentsByContractorRequest>
  | ReturnType<typeof fetchIncidentsByContractorSuccess>
  | ReturnType<typeof fetchIncidentsByContractorFailure>;
