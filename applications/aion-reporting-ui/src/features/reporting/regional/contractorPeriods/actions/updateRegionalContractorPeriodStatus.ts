import axios, { AxiosError } from 'axios';
import { fetchFlexTrackNotificationsCountByClient } from 'features/reporting/regional/contractorNotificationsByClient/actions';
import { fetchRegionalMetricValues } from '../../metricValues/actions/fetchRegionalMetricValues';
import { fetchReportingNotificationsCount } from '@pec/aion-ui-core/actions/fetchReportingNotificationsCount';
import { IContractorPeriod } from 'interfaces/contractorPeriod';
import { PeriodStatus } from 'interfaces/contractorPeriod';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateRegionalContractorPeriodRequest = () =>
  ({
    type: 'UPDATE_REGIONAL_CONTRACTOR_PERIOD_STATUS_REQUEST'
  } as const);

const updateRegionalContractorPeriodSuccess = (payload: IContractorPeriod) =>
  ({
    type: 'UPDATE_REGIONAL_CONTRACTOR_PERIOD_STATUS_SUCCESS',
    payload
  } as const);

const updateRegionalContractorPeriodFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_REGIONAL_CONTRACTOR_PERIOD_STATUS_FAILURE',
    error
  } as const;
};

export const updateRegionalContractorPeriodStatus = (
  contractorPeriodId: string,
  organizationId: string,
  periodId: string,
  status: PeriodStatus,
  clientId: string
): ThunkAction<Promise<IContractorPeriod>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateRegionalContractorPeriodRequest());

      const { data } = await axios.patch<IContractorPeriod>(
        `/api/v3.01/regionalContractorPeriods(${contractorPeriodId})`,
        [
          { op: 'replace', path: '/reportStatus', value: status },
          { op: 'replace', path: '/reportStatusUpdatedDateUtc', value: new Date().toISOString() }
        ]
      );

      dispatch(updateRegionalContractorPeriodSuccess(data));
      dispatch(fetchRegionalMetricValues(organizationId, periodId));
      dispatch(fetchReportingNotificationsCount(organizationId));
      if (status === PeriodStatus.Submitted) {
        dispatch(fetchFlexTrackNotificationsCountByClient(organizationId, clientId));
      }
      resolve(data);
    } catch (error) {
      dispatch(updateRegionalContractorPeriodFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateRegionalContractorPeriodRequest>
  | ReturnType<typeof updateRegionalContractorPeriodSuccess>
  | ReturnType<typeof updateRegionalContractorPeriodFailure>;
