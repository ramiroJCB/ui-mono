import axios, { AxiosError } from 'axios';
import { IRegionalMetric } from 'interfaces/regionalMetric';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRegionalMetricsRequest = () =>
  ({
    type: 'FETCH_REGIONAL_METRICS_REQUEST'
  } as const);

const fetchRegionalMetricsSuccess = (payload: IRegionalMetric[], periodId: string) =>
  ({
    type: 'FETCH_REGIONAL_METRICS_SUCCESS',
    payload,
    periodId
  } as const);

const fetchRegionalMetricsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONAL_METRICS_FAILURE',
    error
  } as const;
};

const shouldFetchRegionalMetrics = (
  { regionalMetrics: { regionalMetrics: metrics, periodId: prevPeriodId, isFetching } }: RootState,
  periodId: string
) => !isFetching && (!metrics || periodId !== prevPeriodId);

const fetchRegionalMetrics = (
  organizationId: string,
  periodId: string,
  clientId?: string
): ThunkAction<Promise<IRegionalMetric[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionalMetricsRequest());

      const params = {
        $orderby: 'displayOrder'
      };

      const {
        data: { value }
      } = await axios.get<{ value: IRegionalMetric[] }>(
        `/api/v3.01/organizations(${organizationId})/periods(${periodId})/regionalMetrics`,
        {
          params: clientId ? { ...params, $filter: `clientId eq ${clientId}` } : params
        }
      );

      dispatch(fetchRegionalMetricsSuccess(value, periodId));
      resolve(value);
    } catch (error) {
      dispatch(fetchRegionalMetricsFailure(error));
      reject(error);
    }
  });
};

export const fetchRegionalMetricsIfNeeded = (
  organizationId: string,
  periodId: string,
  clientId?: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchRegionalMetrics(getState(), periodId)) {
    dispatch(fetchRegionalMetrics(organizationId, periodId, clientId));
  }
};

export type Actions =
  | ReturnType<typeof fetchRegionalMetricsRequest>
  | ReturnType<typeof fetchRegionalMetricsSuccess>
  | ReturnType<typeof fetchRegionalMetricsFailure>;
