import { Actions as FetchWorkGroupJobTypeActions } from './actions/fetchWorkGroupJobType';
import { Actions as UnassignWorkGroupJobTypeActions } from './actions/unassignWorkGroupJobType';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';

export type State = DeepReadonly<{
  isFetching: boolean;
  workGroupJobType: IWorkGroupJobType | null;
  fetchError: AxiosError | null;
  unassignError: AxiosError | null;
}>;

type Actions = FetchWorkGroupJobTypeActions | UnassignWorkGroupJobTypeActions;

export const initialState: State = {
  isFetching: false,
  workGroupJobType: null,
  fetchError: null,
  unassignError: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_WORK_GROUP_JOB_TYPE_REQUEST':
      return {
        ...state,
        isFetching: true,
        fetchError: null
      };
    case 'UNASSIGN_WORK_GROUP_JOB_TYPE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupJobType: null,
        unassignError: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupJobType: action.payload,
        fetchError: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_FAILURE':
      return {
        ...state,
        isFetching: false,
        fetchError: action.error
      };
    case 'UNASSIGN_WORK_GROUP_JOB_TYPE_FAILURE':
      return {
        ...state,
        isFetching: false,
        unassignError: action.error
      };
    default:
      return state;
  }
}
