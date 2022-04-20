import { Actions } from 'actions/users';
import { AxiosError } from 'axios';
import { IUser } from 'interfaces/user';

export type State = {
  readonly isFetching: boolean;
  readonly users: IUser[] | null;
  readonly error: AxiosError | Error | null;
  readonly searchTerm: string;
  readonly currentPage: string;
  readonly pageSize: number;
  readonly totalCount: number;
};

const initialState: State = {
  isFetching: false,
  users: null,
  error: null,
  searchTerm: '',
  currentPage: '0',
  pageSize: 0,
  totalCount: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_USERS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        users: action.payload,
        searchTerm: action.search,
        currentPage: action.page,
        pageSize: action.pageSize,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_USERS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
