import { Actions as FetchJobTypesActions } from './actions';
import { Actions as AddJobTypeActions } from '../jobType/actions/addJobType';
import { Actions as EditJobTypeActions } from '../jobType/actions/editJobType';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  jobTypes: IJobType[];
  totalCount: number;
  error: AxiosError | null;
}>;

type Actions = FetchJobTypesActions | AddJobTypeActions | EditJobTypeActions;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  jobTypes: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_JOB_TYPES_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        jobTypes: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_JOB_TYPES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_JOB_TYPES_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        jobTypes: uniqueById(state.jobTypes, action.payload).sort((a, b) => a.name.localeCompare(b.name)),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_JOB_TYPES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_JOB_TYPE_SUCCESS':
    case 'EDIT_JOB_TYPE_SUCCESS':
      return {
        ...state,
        jobTypes: [],
        totalCount: 0
      };
    default:
      return state;
  }
}
