import axios, { AxiosError } from 'axios';
import { IUser } from 'interfaces/user';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchUserRequest = () =>
  ({
    type: 'FETCH_USER_REQUEST'
  } as const);

export const fetchUserSuccess = (payload: IUser) =>
  ({
    type: 'FETCH_USER_SUCCESS',
    payload
  } as const);

export const fetchUserFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'FETCH_USER_FAILURE',
    error
  } as const;
};

const shouldFetchUser = (state: RootState) => !state.user.isFetching;

const fetchUser = (userId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchUserRequest());

    const usersResponse = await axios.get<IUser[]>('/api/v2/users', {
      params: { filter: `id eq '${userId}'` }
    });
    const user = usersResponse.data[0];
    if (!user) {
      throw new Error(`No user was found with id: ${userId}`);
    }

    dispatch(fetchUserSuccess(user));
  } catch (error) {
    dispatch(fetchUserFailure(error));
  }
};

export const fetchUserIfNeeded = (userId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchUser(getState())) {
    dispatch(fetchUser(userId));
  }
};

export type Actions =
  | ReturnType<typeof fetchUserRequest>
  | ReturnType<typeof fetchUserSuccess>
  | ReturnType<typeof fetchUserFailure>;
