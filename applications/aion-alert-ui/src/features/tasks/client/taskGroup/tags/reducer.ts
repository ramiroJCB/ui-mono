import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITag } from 'interfaces/tag';

export type State = DeepReadonly<{
  isFetching: boolean;
  tags: ITag[] | null;
  error: AxiosError | null;
  currentPage: number;
  total: number | null;
}>;

export const initialState: State = {
  isFetching: false,
  tags: null,
  error: null,
  currentPage: 1,
  total: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TAGS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_TAGS_SUCCESS':
      return {
        isFetching: false,
        tags: action.payload,
        error: null,
        currentPage: action.currentPage,
        total: action.total
      };
    case 'FETCH_TAGS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
