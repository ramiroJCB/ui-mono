import axios, { AxiosError } from 'axios';
import { fetchOperationalMetricValues } from '../../metricValues/actions/fetchOperationalMetricValues';
import { fetchOperationsNotificationsCountByClient } from 'features/reporting/operational/contractorNotificationsByClient/actions';
import { fetchReportingNotificationsCount } from '@pec/aion-ui-core/actions/fetchReportingNotificationsCount';
import { IContractorPeriod } from 'interfaces/contractorPeriod';
import { PeriodStatus } from 'interfaces/contractorPeriod';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const { Submitted } = PeriodStatus;

const updateOperationalContractorPeriodRequest = () =>
  ({
    type: 'UPDATE_OPERATIONAL_CONTRACTOR_PERIOD_STATUS_REQUEST'
  } as const);

const updateOperationalContractorPeriodSuccess = (payload: IContractorPeriod) =>
  ({
    type: 'UPDATE_OPERATIONAL_CONTRACTOR_PERIOD_STATUS_SUCCESS',
    payload
  } as const);

const updateOperationalContractorPeriodFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_OPERATIONAL_CONTRACTOR_PERIOD_STATUS_FAILURE',
    error
  } as const;
};

export const updateOperationalContractorPeriodStatus = (
  contractorPeriodId: string,
  organizationId: string,
  periodId: string,
  clientId: string
): ThunkAction<Promise<IContractorPeriod>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateOperationalContractorPeriodRequest());

      const { data } = await axios.patch<IContractorPeriod>(
        `/api/v3.01/operationalContractorPeriods(${contractorPeriodId})`,
        [
          { op: 'replace', path: '/reportStatus', value: Submitted },
          { op: 'replace', path: '/reportStatusUpdatedDateUtc', value: new Date().toISOString() }
        ]
      );

      dispatch(updateOperationalContractorPeriodSuccess(data));
      dispatch(fetchOperationalMetricValues(organizationId, periodId));
      dispatch(fetchReportingNotificationsCount(organizationId));
      dispatch(fetchOperationsNotificationsCountByClient(organizationId, clientId));
      resolve(data);
    } catch (error) {
      dispatch(updateOperationalContractorPeriodFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateOperationalContractorPeriodRequest>
  | ReturnType<typeof updateOperationalContractorPeriodSuccess>
  | ReturnType<typeof updateOperationalContractorPeriodFailure>;
