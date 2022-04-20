import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IMappedRegionMetrics } from 'interfaces/mappedRegionMetrics';
import { IRegion } from 'interfaces/region';
import { IRegionalMetric } from 'interfaces/regionalMetric';
import { IRegionalMetricValue } from 'interfaces/regionalMetricValue';
import { mapRegionMetrics } from '../contractor/helpers';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { fetchAll } from '@pec/aion-ui-odata/helpers/fetchAll';

const fetchRegionalMetricValuesByContractorRequest = (contractorId: string) =>
  ({
    type: 'FETCH_REGIONAL_METRIC_VALUES_BY_CONTRACTOR_REQUEST',
    contractorId
  } as const);

const fetchRegionalMetricValuesByContractorSuccess = (
  contractorId: string,
  search: string,
  periodId: string,
  payload: IMappedRegionMetrics[]
) =>
  ({
    type: 'FETCH_REGIONAL_METRIC_VALUES_BY_CONTRACTOR_SUCCESS',
    contractorId,
    search,
    periodId,
    payload
  } as const);

const fetchRegionalMetricValuesByContractorFailure = (contractorId: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONAL_METRIC_VALUES_BY_CONTRACTOR_FAILURE',
    contractorId,
    error
  } as const;
};

const fetchRegionalMetricValuesByContractor = (
  periodId: string,
  contractorId: string,
  selectedRegions: DeepReadonly<IRegion[]>,
  selectedRegionalMetrics: DeepReadonly<IRegionalMetric[]>,
  search: string
): ThunkAction<Promise<IMappedRegionMetrics[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionalMetricValuesByContractorRequest(contractorId));
      const regionIds = `regionId in (${selectedRegions.map(({ id }) => `'${id}'`).join(',')})`;
      const regionalMetricIds = `regionalMetricId in (${selectedRegionalMetrics.map(({ id }) => `'${id}'`).join(',')})`;
      const $filter = `${regionIds} and (${regionalMetricIds}) and (periodId eq ${periodId})`;
      const metricValues = await fetchAll<IRegionalMetricValue>(
        `/api/v3.01/organizations(${contractorId})/regionalMetricValues`,
        {
          params: {
            $filter
          }
        }
      );

      const mappedRegionMetrics = mapRegionMetrics(selectedRegions, selectedRegionalMetrics, metricValues.value);
      dispatch(fetchRegionalMetricValuesByContractorSuccess(contractorId, search, periodId, mappedRegionMetrics));
      resolve(mappedRegionMetrics);
    } catch (error) {
      dispatch(fetchRegionalMetricValuesByContractorFailure(contractorId, error));
      reject(error);
    }
  });
};

const shouldFetchRegionalMetricValuesByContractor = (
  { regionalMetricValuesByContractor }: RootState,
  periodId: string,
  contractorId: string
) => {
  const metricValues = regionalMetricValuesByContractor[contractorId];
  return (
    !metricValues ||
    (!metricValues.isFetching &&
      !metricValues.error &&
      (!metricValues.regionMetrics || metricValues.periodId !== periodId))
  );
};

export const fetchRegionalMetricValuesByContractorIfNeeded = (
  periodId: string,
  contractorId: string,
  selectedRegions: DeepReadonly<IRegion[]>,
  selectedRegionalMetrics: DeepReadonly<IRegionalMetric[]>,
  search: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchRegionalMetricValuesByContractor(getState(), periodId, contractorId)) {
    dispatch(
      fetchRegionalMetricValuesByContractor(periodId, contractorId, selectedRegions, selectedRegionalMetrics, search)
    );
  }
};

export type Actions =
  | ReturnType<typeof fetchRegionalMetricValuesByContractorRequest>
  | ReturnType<typeof fetchRegionalMetricValuesByContractorSuccess>
  | ReturnType<typeof fetchRegionalMetricValuesByContractorFailure>;
