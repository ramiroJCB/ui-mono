import axios, { AxiosError } from 'axios';
import { IOperationalMetricValue } from 'interfaces/operationalMetricValue';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchOperationalMetricValuesRequest = () =>
  ({
    type: 'FETCH_OPERATIONAL_METRIC_VALUES_REQUEST'
  } as const);

const fetchOperationalMetricValuesSuccess = (payload: IOperationalMetricValue[]) =>
  ({
    type: 'FETCH_OPERATIONAL_METRIC_VALUES_SUCCESS',
    payload
  } as const);

const fetchOperationalMetricValuesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_OPERATIONAL_METRIC_VALUES_FAILURE',
    error
  } as const;
};

export const fetchOperationalMetricValues = (
  organizationId: string,
  periodId: string
): ThunkAction<Promise<IOperationalMetricValue[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchOperationalMetricValuesRequest());

      const {
        data: { value }
      } = await axios.get<{ value: IOperationalMetricValue[] }>(
        `/api/v3.01/organizations(${organizationId})/operationalMetricValues`,
        {
          params: { $filter: `(periodId eq ${periodId}) and (contractorId eq ${organizationId})` }
        }
      );

      dispatch(fetchOperationalMetricValuesSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchOperationalMetricValuesFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchOperationalMetricValuesRequest>
  | ReturnType<typeof fetchOperationalMetricValuesSuccess>
  | ReturnType<typeof fetchOperationalMetricValuesFailure>;
