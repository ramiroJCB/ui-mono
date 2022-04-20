import axios, { AxiosError } from 'axios';
import { IUser } from 'interfaces/user';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchUsersRequest = () =>
  ({
    type: 'FETCH_USERS_REQUEST'
  } as const);

export const fetchUsersSuccess = (
  payload: IUser[],
  search: string,
  page: string,
  pageSize: number,
  totalCount: number
) =>
  ({
    type: 'FETCH_USERS_SUCCESS',
    payload,
    search,
    page,
    pageSize,
    totalCount
  } as const);

export const fetchUsersFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'FETCH_USERS_FAILURE',
    error
  } as const;
};

const shouldFetchUsers = (state: RootState, search: string, page: string) => {
  const {
    users: { searchTerm, currentPage }
  } = state;

  return search !== searchTerm || page !== currentPage;
};

const fetchUsers = (
  search: string,
  page: string,
  pageSize: number
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchUsersRequest());

    const response = await axios.get<IUser[]>('/api/v2/users', {
      params: {
        search,
        page,
        pageSize
      }
    });

    const totalCount = JSON.parse(response.headers['x-pagination']).TotalCount;

    dispatch(fetchUsersSuccess(response.data, search, page, pageSize, totalCount));
  } catch (error) {
    dispatch(fetchUsersFailure(error));
  }
};

export const fetchUsersIfNeeded = (
  search: string,
  page: string = '1',
  pageSize: number = 10
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchUsers(getState(), search, page)) {
    dispatch(fetchUsers(search, page, pageSize));
  }
};

export type Actions =
  | ReturnType<typeof fetchUsersRequest>
  | ReturnType<typeof fetchUsersSuccess>
  | ReturnType<typeof fetchUsersFailure>;
