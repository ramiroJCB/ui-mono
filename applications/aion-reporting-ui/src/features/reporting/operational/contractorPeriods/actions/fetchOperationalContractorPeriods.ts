import axios, { AxiosError } from 'axios';
import { IContractorPeriod } from 'interfaces/contractorPeriod';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchOperationalContractorPeriodsRequest = () =>
  ({
    type: 'FETCH_OPERATIONAL_CONTRACTOR_PERIODS_REQUEST'
  } as const);

const fetchOperationalContractorPeriodsSuccess = (payload: IContractorPeriod[]) =>
  ({
    type: 'FETCH_OPERATIONAL_CONTRACTOR_PERIODS_SUCCESS',
    payload
  } as const);

const fetchOperationalContractorPeriodsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_OPERATIONAL_CONTRACTOR_PERIODS_FAILURE',
    error
  } as const;
};

const shouldFetchOperationalContractorPeriods = ({ operationalContractorPeriods: { isFetching } }: RootState) =>
  !isFetching;

const fetchOperationalContractorPeriods = (
  organizationId: string,
  clientId: string
): ThunkAction<Promise<IContractorPeriod[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchOperationalContractorPeriodsRequest());
      const {
        data: { value }
      } = await axios.get<{ value: IContractorPeriod[] }>('/api/v3.01/operationalContractorPeriods', {
        params: {
          $orderby: 'startDate desc',
          $filter: `(clientId eq ${clientId} and contractorId eq ${organizationId})`
        }
      });

      dispatch(fetchOperationalContractorPeriodsSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchOperationalContractorPeriodsFailure(error));
      reject(error);
    }
  });
};

export const fetchOperationalContractorPeriodsIfNeeded = (
  organizationId: string,
  clientId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchOperationalContractorPeriods(getState())) {
    dispatch(fetchOperationalContractorPeriods(organizationId, clientId));
  }
};

export type Actions =
  | ReturnType<typeof fetchOperationalContractorPeriodsRequest>
  | ReturnType<typeof fetchOperationalContractorPeriodsSuccess>
  | ReturnType<typeof fetchOperationalContractorPeriodsFailure>;
