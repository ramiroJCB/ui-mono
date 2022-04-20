import axios, { AxiosError } from 'axios';
import { IMappedMetric } from 'interfaces/mappedMetric';
import { IRegionalMetricValue } from 'interfaces/regionalMetricValue';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateRegionalMetricValueRequest = () =>
  ({
    type: 'UPDATE_REGIONAL_METRIC_VALUE_REQUEST'
  } as const);

const updateRegionalMetricValueSuccess = (payload: IRegionalMetricValue) =>
  ({
    type: 'UPDATE_REGIONAL_METRIC_VALUE_SUCCESS',
    payload
  } as const);

const updateRegionalMetricValueFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_REGIONAL_METRIC_VALUE_FAILURE',
    error
  } as const;
};

export const updateRegionalMetricValue = (
  organizationId: string,
  { metricValueId, value }: IMappedMetric
): ThunkAction<Promise<IRegionalMetricValue>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateRegionalMetricValueRequest());

      const { data } = await axios.patch<IRegionalMetricValue>(
        `/api/v3.01/organizations(${organizationId})/regionalMetricValues(${metricValueId})`,
        [{ op: 'replace', path: '/value', value }]
      );

      dispatch(updateRegionalMetricValueSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateRegionalMetricValueFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateRegionalMetricValueRequest>
  | ReturnType<typeof updateRegionalMetricValueSuccess>
  | ReturnType<typeof updateRegionalMetricValueFailure>;
