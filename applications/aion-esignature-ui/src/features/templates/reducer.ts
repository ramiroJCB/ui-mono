import { Actions as FetchTemplatesActions } from './actions/fetchTemplates';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITemplate } from 'interfaces/template';

export type State = DeepReadonly<{
  isFetching: boolean;
  templates: ITemplate[];
  totalCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  templates: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: FetchTemplatesActions): State {
  switch (action.type) {
    case 'FETCH_TEMPLATES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_TEMPLATES_SUCCESS':
      return {
        isFetching: false,
        templates: action.payload,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_TEMPLATES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
