import axios, { AxiosError } from 'axios';
import { IVerification } from 'interfaces/verification';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchVerificationsRequest = () =>
  ({
    type: 'FETCH_VERIFICATIONS_REQUEST'
  } as const);

const fetchVerificationsSuccess = (payload: IVerification[]) =>
  ({
    type: 'FETCH_VERIFICATIONS_SUCCESS',
    payload
  } as const);

const fetchVerificationsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_VERIFICATIONS_FAILURE',
    error
  } as const;
};

const shouldFetchVerifications = (state: RootState) => {
  const {
    verifications: { isFetching, error, verifications }
  } = state;

  return !isFetching && !error && !verifications;
};

const fetchVerifications = (organizationId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchVerificationsRequest());

    const response = await axios.get<IVerification[]>(`/api/v2/organizations/${organizationId}/verifications`);

    dispatch(fetchVerificationsSuccess(response.data));
  } catch (error) {
    dispatch(fetchVerificationsFailure(error));
  }
};

export const fetchVerificationsIfNeeded = (organizationId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchVerifications(getState())) {
    dispatch(fetchVerifications(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchVerificationsRequest>
  | ReturnType<typeof fetchVerificationsSuccess>
  | ReturnType<typeof fetchVerificationsFailure>;
