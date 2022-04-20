import axios, { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IMappedMetric } from 'interfaces/mappedMetric';
import { IOperationalMetric } from 'interfaces/operationalMetric';
import { IOperationalMetricValue } from 'interfaces/operationalMetricValue';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchOperationalMetricValuesByContractorRequest = (contractorId: string) =>
  ({
    type: 'FETCH_OPERATIONAL_METRIC_VALUES_BY_CONTRACTOR_REQUEST',
    contractorId
  } as const);

const fetchOperationalMetricValuesByContractorSuccess = (
  contractorId: string,
  search: string,
  periodId: string,
  payload: IMappedMetric[]
) =>
  ({
    type: 'FETCH_OPERATIONAL_METRIC_VALUES_BY_CONTRACTOR_SUCCESS',
    contractorId,
    search,
    periodId,
    payload
  } as const);

const fetchOperationalMetricValuesByContractorFailure = (contractorId: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_OPERATIONAL_METRIC_VALUES_BY_CONTRACTOR_FAILURE',
    contractorId,
    error
  } as const;
};

export const fetchOperationalMetricValuesByContractor = (
  periodId: string,
  contractorId: string,
  selectedOperationalMetrics: DeepReadonly<IOperationalMetric[]>,
  search: string
): ThunkAction<Promise<IMappedMetric[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchOperationalMetricValuesByContractorRequest(contractorId));
      const operationalMetricsIds = `operationalMetricId in (${selectedOperationalMetrics
        .map(({ id }) => `'${id}'`)
        .join(',')})`;

      const { data } = await axios.get<{ value: IOperationalMetricValue[] }>(
        `/api/v3.01/organizations(${contractorId})/operationalMetricValues`,
        {
          params: {
            $filter: `${operationalMetricsIds} and (periodId eq ${periodId})`
          }
        }
      );

      const mappedMetrics = selectedOperationalMetrics.map(metric => {
        const value = data.value.find(metricValue => metric.id === metricValue.operationalMetricId);
        return value ? { ...metric, metricValueId: value.id, value: value.value } : { ...metric };
      });

      dispatch(fetchOperationalMetricValuesByContractorSuccess(contractorId, search, periodId, mappedMetrics));
      resolve(mappedMetrics);
    } catch (error) {
      dispatch(fetchOperationalMetricValuesByContractorFailure(contractorId, error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchOperationalMetricValuesByContractorRequest>
  | ReturnType<typeof fetchOperationalMetricValuesByContractorSuccess>
  | ReturnType<typeof fetchOperationalMetricValuesByContractorFailure>;
