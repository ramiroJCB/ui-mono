import axios, { AxiosError } from 'axios';
import { IClientPeriod } from 'interfaces/clientPeriod';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientPeriodsRequest = () =>
  ({
    type: 'FETCH_CLIENT_PERIODS_REQUEST'
  } as const);

const fetchClientPeriodsSuccess = (payload: IClientPeriod[]) =>
  ({
    type: 'FETCH_CLIENT_PERIODS_SUCCESS',
    payload
  } as const);

const fetchClientPeriodsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_PERIODS_FAILURE',
    error
  } as const;
};

const shouldFetchClientPeriods = ({ clientPeriods: { isFetching, clientPeriods } }: RootState) =>
  !isFetching && !clientPeriods;

export const fetchClientPeriods = (
  organizationId: string
): ThunkAction<Promise<IClientPeriod[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientPeriodsRequest());

      const {
        data: { value }
      } = await axios.get<{ value: IClientPeriod[] }>(`/api/v3.01/organizations(${organizationId})/periods`, {
        params: {
          $orderby: 'startDate desc'
        }
      });

      dispatch(fetchClientPeriodsSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchClientPeriodsFailure(error));
      reject(error);
    }
  });
};

export const fetchClientPeriodsIfNeeded = (
  organizationId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async (dispatch, getState) => {
  return new Promise(async resolve => {
    if (shouldFetchClientPeriods(getState())) {
      await dispatch(fetchClientPeriods(organizationId));
      resolve();
    } else {
      resolve();
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchClientPeriodsRequest>
  | ReturnType<typeof fetchClientPeriodsSuccess>
  | ReturnType<typeof fetchClientPeriodsFailure>;
