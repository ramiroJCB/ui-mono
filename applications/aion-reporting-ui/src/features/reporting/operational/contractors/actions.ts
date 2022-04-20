import axios, { AxiosError } from 'axios';
import { fetchClientPeriodsIfNeeded } from 'features/clientPeriods/actions';
import { getStatus } from 'helpers';
import { IContractorPeriod } from 'interfaces/contractorPeriod';
import { IMetricContractor } from 'interfaces/metricContractor';
import { makeSkipParam } from '@pec/aion-ui-odata/helpers/formatters';
import { ParsedUrlQuery } from 'querystring';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchOperationalContractorsRequest = () =>
  ({
    type: 'FETCH_OPERATIONAL_CONTRACTORS_REQUEST'
  } as const);

const fetchOperationalContractorsSuccess = (payload: IMetricContractor[], totalCount: number) =>
  ({
    type: 'FETCH_OPERATIONAL_CONTRACTORS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchOperationalContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_OPERATIONAL_CONTRACTORS_FAILURE',
    error
  } as const;
};

const shouldFetchOperationalContractors = ({ operationalContractors: { isFetching } }: RootState) => !isFetching;

export const fetchOperationalContractors = (
  organizationId: string,
  periodId: string,
  contractorIds: string[],
  { page }: ParsedUrlQuery
): ThunkAction<Promise<IMetricContractor[]>, RootState, null, Actions> => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchOperationalContractorsRequest());
      const $top = 10;
      const $skip = makeSkipParam(page || '1', $top);
      const defaultFilters = `(clientId eq ${organizationId}) and (periodId eq ${periodId})`;
      const buildContractorIdFilter = (ids: string[]) => {
        if (ids.length > 0) {
          return `contractorId in (${ids.map(id => `'${id}'`).join(',')}) and ${defaultFilters}`;
        } else {
          return defaultFilters;
        }
      };
      const $filter = buildContractorIdFilter(contractorIds);

      const response = await axios.get<{ value: IContractorPeriod[]; '@odata.count': number }>(
        '/api/v3.01/operationalContractorPeriods',
        {
          params: {
            $filter,
            $orderby: 'contractorName',
            $skip, // API
            $top, // API
            _limit: $top, // json-server
            _page: page // json-server
          }
        }
      );

      const payload = response.data.value || response.data; // API || json-server
      const totalCount = response.data['@odata.count'] || parseInt(response.headers['x-total-count'], 10); // API || json-server

      await dispatch(fetchClientPeriodsIfNeeded(organizationId));

      const { clientPeriods: periods } = getState().clientPeriods;
      const selectedPeriod = periods && periodId && periods.find(p => p.id === periodId);
      const contractors = payload.map(({ contractorId, contractorName, reportStatus, reportStatusUpdatedDateUtc }) => {
        if (selectedPeriod) {
          const { endDate, gracePeriodMillis } = selectedPeriod;
          const status = getStatus(endDate, gracePeriodMillis, reportStatus, reportStatusUpdatedDateUtc);

          return {
            id: contractorId,
            name: contractorName,
            metricStatus: reportStatus,
            metricStatusUpdatedDateUtc: reportStatusUpdatedDateUtc,
            displayMetricStatus: status
          } as IMetricContractor;
        } else {
          return {
            id: contractorId,
            name: contractorName,
            metricStatus: reportStatus,
            metricStatusUpdatedDateUtc: reportStatusUpdatedDateUtc
          } as IMetricContractor;
        }
      });

      dispatch(fetchOperationalContractorsSuccess(contractors, totalCount));
      resolve(contractors);
    } catch (error) {
      dispatch(fetchOperationalContractorsFailure(error));
      reject(error);
    }
  });
};

export const fetchOperationalContractorsIfNeeded = (
  organizationId: string,
  periodId: string,
  contractorIds: string[],
  search: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchOperationalContractors(getState())) {
    dispatch(fetchOperationalContractors(organizationId, periodId, contractorIds, search));
  }
};

export type Actions =
  | ReturnType<typeof fetchOperationalContractorsRequest>
  | ReturnType<typeof fetchOperationalContractorsSuccess>
  | ReturnType<typeof fetchOperationalContractorsFailure>;
