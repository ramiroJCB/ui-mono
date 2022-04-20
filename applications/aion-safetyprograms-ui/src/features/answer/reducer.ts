import { Actions } from './actions/updateAnswer';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IAnswer } from 'interfaces/answer';

export type State = DeepReadonly<{
  isFetching: boolean;
  answer: IAnswer | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  answer: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'UPDATE_ANSWER_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'UPDATE_ANSWER_SUCCESS':
      return {
        isFetching: false,
        answer: action.payload,
        error: null
      };
    case 'UPDATE_ANSWER_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
