import { Actions } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';

export type State = DeepReadonly<{
  isFetching: boolean;
  workGroups: IWorkGroup[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  workGroups: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_WORK_GROUPS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_WORK_GROUPS_SUCCESS':
      return {
        isFetching: false,
        workGroups: action.payload,
        error: null
      };
    case 'FETCH_WORK_GROUPS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
