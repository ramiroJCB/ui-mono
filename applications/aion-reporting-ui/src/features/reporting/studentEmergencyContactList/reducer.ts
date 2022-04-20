import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';

export type State = DeepReadonly<{
  isFetching: boolean;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'DOWNLOAD_STUDENT_EMERGENCY_CONTACT_LIST_REPORT_REQUEST':
      return {
        isFetching: true,
        error: null
      };
    case 'DOWNLOAD_STUDENT_EMERGENCY_CONTACT_LIST_REPORT_SUCCESS':
      return {
        ...state,
        isFetching: false
      };
    case 'DOWNLOAD_STUDENT_EMERGENCY_CONTACT_LIST_REPORT_FAILURE':
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
