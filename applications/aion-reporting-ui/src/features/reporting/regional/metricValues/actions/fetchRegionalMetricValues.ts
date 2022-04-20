import axios, { AxiosError } from 'axios';
import { IRegionalMetricValue } from 'interfaces/regionalMetricValue';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRegionalMetricValuesRequest = () =>
  ({
    type: 'FETCH_REGIONAL_METRIC_VALUES_REQUEST'
  } as const);

const fetchRegionalMetricValuesSuccess = (payload: IRegionalMetricValue[]) =>
  ({
    type: 'FETCH_REGIONAL_METRIC_VALUES_SUCCESS',
    payload
  } as const);

const fetchRegionalMetricValuesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONAL_METRIC_VALUES_FAILURE',
    error
  } as const;
};

const getMetricValues = (organizationId: string, periodId: string, $skip: number) =>
  axios.get<{ '@odata.count': number; value: IRegionalMetricValue[] }>(
    `/api/v3.01/organizations(${organizationId})/regionalMetricValues`,
    {
      params: { $filter: `periodId eq ${periodId}`, $skip }
    }
  );

const aggregateMetricValues = async (organizationId: string, periodId: string) => {
  let values: IRegionalMetricValue[] = [];
  let oDataCount = 0;

  do {
    const { data } = await getMetricValues(organizationId, periodId, values.length);
    values = values.concat(data.value);
    oDataCount = data['@odata.count'];
  } while (values.length < oDataCount);

  return values;
};

export const fetchRegionalMetricValues = (
  organizationId: string,
  periodId: string
): ThunkAction<Promise<IRegionalMetricValue[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionalMetricValuesRequest());

      const values = await aggregateMetricValues(organizationId, periodId);

      dispatch(fetchRegionalMetricValuesSuccess(values));
      resolve(values);
    } catch (error) {
      dispatch(fetchRegionalMetricValuesFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchRegionalMetricValuesRequest>
  | ReturnType<typeof fetchRegionalMetricValuesSuccess>
  | ReturnType<typeof fetchRegionalMetricValuesFailure>;
