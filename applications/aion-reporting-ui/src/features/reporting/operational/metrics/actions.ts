import axios, { AxiosError } from 'axios';
import { IOperationalMetric } from 'interfaces/operationalMetric';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchOperationalMetricsRequest = () =>
  ({
    type: 'FETCH_OPERATIONAL_METRICS_REQUEST'
  } as const);

const fetchOperationalMetricsSuccess = (payload: IOperationalMetric[], periodId: string) =>
  ({
    type: 'FETCH_OPERATIONAL_METRICS_SUCCESS',
    payload,
    periodId
  } as const);

const fetchOperationalMetricsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_OPERATIONAL_METRICS_FAILURE',
    error
  } as const;
};

const shouldFetchOperationalMetrics = (
  { operationalMetrics: { operationalMetrics, periodId: prevPeriodId, isFetching } }: RootState,
  periodId: string
) => !isFetching && (!operationalMetrics || periodId !== prevPeriodId);

const fetchOperationalMetrics = (
  organizationId: string,
  periodId: string,
  clientId?: string
): ThunkAction<Promise<IOperationalMetric[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchOperationalMetricsRequest());

      const params = {
        $orderby: 'name'
      };

      const {
        data: { value }
      } = await axios.get<{ value: IOperationalMetric[] }>(
        `/api/v3.01/organizations(${organizationId})/periods(${periodId})/operationalMetrics`,
        {
          params: clientId ? { ...params, $filter: `clientId eq ${clientId}` } : params
        }
      );

      dispatch(fetchOperationalMetricsSuccess(value, periodId));
      resolve(value);
    } catch (error) {
      dispatch(fetchOperationalMetricsFailure(error));
      reject(error);
    }
  });
};

export const fetchOperationalMetricsIfNeeded = (
  organizationId: string,
  periodId: string,
  clientId?: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchOperationalMetrics(getState(), periodId)) {
    dispatch(fetchOperationalMetrics(organizationId, periodId, clientId));
  }
};

export type Actions =
  | ReturnType<typeof fetchOperationalMetricsRequest>
  | ReturnType<typeof fetchOperationalMetricsSuccess>
  | ReturnType<typeof fetchOperationalMetricsFailure>;
