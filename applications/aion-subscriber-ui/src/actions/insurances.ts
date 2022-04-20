import axios, { AxiosError } from 'axios';
import { IInsurance } from 'interfaces/insurance';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInsurancesRequest = () =>
  ({
    type: 'FETCH_INSURANCES_REQUEST'
  } as const);

const fetchInsurancesSuccess = (payload: IInsurance[]) =>
  ({
    type: 'FETCH_INSURANCES_SUCCESS',
    payload
  } as const);

const fetchInsurancesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_INSURANCES_FAILURE',
    error
  } as const;
};

const shouldFetchInsurances = ({ insurances: { isFetching, error, insurances } }: RootState) =>
  !isFetching && !error && !insurances;

export const fetchInsurances = (
  organizationId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchInsurancesRequest());

    const response = await axios.get<IInsurance[]>(`/api/v2/organizations/${organizationId}/insurances`, {
      params: {
        orderBy: 'organizationName asc',
        filter: `earliestPolicyExpirationDate ne 'null'`
      }
    });

    dispatch(fetchInsurancesSuccess(response.data));
  } catch (error) {
    dispatch(fetchInsurancesFailure(error));
  }
};

export const fetchInsurancesIfNeeded = (organizationId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchInsurances(getState())) {
    dispatch(fetchInsurances(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchInsurancesRequest>
  | ReturnType<typeof fetchInsurancesSuccess>
  | ReturnType<typeof fetchInsurancesFailure>;
