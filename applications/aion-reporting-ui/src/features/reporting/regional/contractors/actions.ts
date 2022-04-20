import axios, { AxiosError } from 'axios';
import { fetchClientPeriodsIfNeeded } from 'features/clientPeriods/actions';
import { getStatus } from 'helpers';
import { IMetricContractor } from 'interfaces/metricContractor';
import { makeSkipParam } from '@pec/aion-ui-odata/helpers/formatters';
import { ParsedUrlQuery } from 'querystring';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRegionalContractorsRequest = () =>
  ({
    type: 'FETCH_REGIONAL_CONTRACTORS_REQUEST'
  } as const);

const fetchRegionalContractorsSuccess = (payload: IMetricContractor[], totalCount: number) =>
  ({
    type: 'FETCH_REGIONAL_CONTRACTORS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchRegionalContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONAL_CONTRACTORS_FAILURE',
    error
  } as const;
};

const shouldFetchRegionalContractors = ({ regionalContractors: { isFetching } }: RootState) => !isFetching;

export const fetchRegionalContractors = (
  organizationId: string,
  periodId: string,
  contractorIds: string[],
  { page, regionIds, metricIds }: ParsedUrlQuery
): ThunkAction<Promise<IMetricContractor[]>, RootState, null, Actions> => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionalContractorsRequest());
      const $top = 10;
      const $skip = makeSkipParam(page || '1', $top);

      const $filter = contractorIds.length > 0 ? `id in (${contractorIds.map(id => `'${id}'`).join(',')})` : undefined;

      const response = await axios.get<{ value: IMetricContractor[]; '@odata.count': number }>(
        `/spapi/organizations/${organizationId}/periods/${periodId}/contractors`,
        {
          params: {
            regionIds: regionIds instanceof Array ? regionIds.join(',') : regionIds,
            metricIds: metricIds instanceof Array ? metricIds.join(',') : metricIds,
            $filter,
            $orderby: 'name',
            $skip, // API
            $top, // API
            _limit: $top, // json-server
            _page: page // json-server
          }
        }
      );

      let contractors = response.data.value || response.data; // API || json-server
      const totalCount = response.data['@odata.count'] || parseInt(response.headers['x-total-count'], 10); // API || json-server

      await dispatch(fetchClientPeriodsIfNeeded(organizationId));

      const { clientPeriods: periods } = getState().clientPeriods;
      const selectedPeriod = periods && periodId && periods.find(p => p.id === periodId);

      contractors = contractors.map(contractor => {
        const { metricStatus, metricStatusUpdatedDateUtc } = contractor;

        if (selectedPeriod) {
          const { endDate, gracePeriodMillis } = selectedPeriod;
          const status = getStatus(endDate, gracePeriodMillis, metricStatus, metricStatusUpdatedDateUtc);

          return { ...contractor, displayMetricStatus: status };
        } else {
          return contractor;
        }
      });

      dispatch(fetchRegionalContractorsSuccess(contractors, totalCount));
      resolve(contractors);
    } catch (error) {
      dispatch(fetchRegionalContractorsFailure(error));
      reject(error);
    }
  });
};

export const fetchRegionalContractorsIfNeeded = (
  organizationId: string,
  periodId: string,
  contractorIds: string[],
  search: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchRegionalContractors(getState())) {
    dispatch(fetchRegionalContractors(organizationId, periodId, contractorIds, search));
  }
};

export type Actions =
  | ReturnType<typeof fetchRegionalContractorsRequest>
  | ReturnType<typeof fetchRegionalContractorsSuccess>
  | ReturnType<typeof fetchRegionalContractorsFailure>;
