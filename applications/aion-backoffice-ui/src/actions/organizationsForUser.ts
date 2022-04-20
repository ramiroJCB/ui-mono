import axios, { AxiosError } from 'axios';
import { IUserOrganization } from '@pec/aion-ui-core/interfaces/userOrganization';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchOrganizationsForUserRequest = () =>
  ({
    type: 'FETCH_ORGANIZATIONS_FOR_USER_REQUEST'
  } as const);

export const fetchOrganizationsForUserSuccess = (payload: IUserOrganization[]) =>
  ({
    type: 'FETCH_ORGANIZATIONS_FOR_USER_SUCCESS',
    payload
  } as const);

export const fetchOrganizationsForUserFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'FETCH_ORGANIZATIONS_FOR_USER_FAILURE',
    error
  } as const;
};

export const shouldFetchOrganizationsForUser = ({ organizationsForUser: { isFetching } }: RootState) => !isFetching;

export const fetchOrganizationsForUser = (
  userId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchOrganizationsForUserRequest());

    const { data } = await axios.get<IUserOrganization[]>('/api/v3.00/userOrganizations', {
      params: {
        userId
      }
    });

    dispatch(fetchOrganizationsForUserSuccess(data));
  } catch (error) {
    dispatch(fetchOrganizationsForUserFailure(error));
  }
};

export const fetchOrganizationsForUserIfNeeded = (userId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchOrganizationsForUser(getState())) {
    dispatch(fetchOrganizationsForUser(userId));
  }
};

export type Actions =
  | ReturnType<typeof fetchOrganizationsForUserRequest>
  | ReturnType<typeof fetchOrganizationsForUserSuccess>
  | ReturnType<typeof fetchOrganizationsForUserFailure>;
