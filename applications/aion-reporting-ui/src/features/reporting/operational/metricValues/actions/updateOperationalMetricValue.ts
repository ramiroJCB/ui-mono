import axios, { AxiosError } from 'axios';
import { IMappedOperationalMetric } from 'interfaces/mappedOperationalMetric';
import { IOperationalMetricValue } from 'interfaces/operationalMetricValue';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateOperationalMetricValueRequest = () =>
  ({
    type: 'UPDATE_OPERATIONAL_METRIC_VALUE_REQUEST'
  } as const);

const updateOperationalMetricValueSuccess = (payload: IOperationalMetricValue) =>
  ({
    type: 'UPDATE_OPERATIONAL_METRIC_VALUE_SUCCESS',
    payload
  } as const);

const updateOperationalMetricValueFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_OPERATIONAL_METRIC_VALUE_FAILURE',
    error
  } as const;
};

export const updateOperationalMetricValue = (
  organizationId: string,
  { metricValueId, value }: IMappedOperationalMetric
): ThunkAction<Promise<IOperationalMetricValue>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateOperationalMetricValueRequest());

      const { data } = await axios.patch<IOperationalMetricValue>(
        `/api/v3.01/organizations(${organizationId})/operationalMetricValues(${metricValueId})`,
        [{ op: 'replace', path: '/value', value }]
      );

      dispatch(updateOperationalMetricValueSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateOperationalMetricValueFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateOperationalMetricValueRequest>
  | ReturnType<typeof updateOperationalMetricValueSuccess>
  | ReturnType<typeof updateOperationalMetricValueFailure>;
