import { Actions } from './actions/fetchReferences';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReference } from 'interfaces/reference';

export type State = DeepReadonly<{
  isFetching: boolean;
  references: IReference[] | null;
  questionAnswerId: string | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  references: null,
  questionAnswerId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REFERENCES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_REFERENCES_SUCCESS':
      return {
        isFetching: false,
        references: action.payload,
        questionAnswerId: action.questionAnswerId,
        error: null
      };
    case 'FETCH_REFERENCES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
