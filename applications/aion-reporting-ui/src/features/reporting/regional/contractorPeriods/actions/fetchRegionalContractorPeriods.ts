import axios, { AxiosError } from 'axios';
import { IContractorPeriod } from 'interfaces/contractorPeriod';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRegionalContractorPeriodsRequest = () =>
  ({
    type: 'FETCH_REGIONAL_CONTRACTOR_PERIODS_REQUEST'
  } as const);

const fetchRegionalContractorPeriodsSuccess = (payload: IContractorPeriod[]) =>
  ({
    type: 'FETCH_REGIONAL_CONTRACTOR_PERIODS_SUCCESS',
    payload
  } as const);

const fetchRegionalContractorPeriodsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONAL_CONTRACTOR_PERIODS_FAILURE',
    error
  } as const;
};

const shouldFetchRegionalContractorPeriods = ({ regionalContractorPeriods: { isFetching } }: RootState) => !isFetching;

const fetchRegionalContractorPeriods = (
  organizationId: string,
  clientId: string
): ThunkAction<Promise<IContractorPeriod[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionalContractorPeriodsRequest());

      const params = {
        $orderby: 'endDate desc'
      };

      const {
        data: { value }
      } = await axios.get<{ value: IContractorPeriod[] }>('/api/v3.01/regionalContractorPeriods', {
        params: clientId
          ? { ...params, $filter: `clientId eq ${clientId} and contractorId eq ${organizationId}` }
          : params
      });

      dispatch(fetchRegionalContractorPeriodsSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchRegionalContractorPeriodsFailure(error));
      reject(error);
    }
  });
};

export const fetchRegionalContractorPeriodsIfNeeded = (
  organizationId: string,
  clientId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchRegionalContractorPeriods(getState())) {
    dispatch(fetchRegionalContractorPeriods(organizationId, clientId));
  }
};

export type Actions =
  | ReturnType<typeof fetchRegionalContractorPeriodsRequest>
  | ReturnType<typeof fetchRegionalContractorPeriodsSuccess>
  | ReturnType<typeof fetchRegionalContractorPeriodsFailure>;
