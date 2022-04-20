import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IJobTypeWorkGroup } from 'interfaces/jobTypeWorkGroup';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetching: boolean;
  isFetchingInitial: boolean;
  jobTypeWorkGroups: IJobTypeWorkGroup[];
  totalCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  jobTypeWorkGroups: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_JOB_TYPE_WORK_GROUPS_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        jobTypeWorkGroups: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_JOB_TYPE_WORK_GROUPS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_JOB_TYPE_WORK_GROUPS_SUCCESS':
      return {
        isFetching: false,
        isFetchingInitial: false,
        jobTypeWorkGroups: uniqueById(state.jobTypeWorkGroups, action.payload).sort((a, b) =>
          a.workGroupName.localeCompare(b.workGroupName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_JOB_TYPE_WORK_GROUPS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
