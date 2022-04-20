import { Actions as AddJobTypeActions } from './actions/addJobType';
import { Actions as FetchJobTypeActions } from './actions/fetchJobType';
import { Actions as EditJobTypeActions } from './actions/editJobType';
import { Actions as DeleteJobTypeActions } from './actions/deleteJobType';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';

export type State = DeepReadonly<{
  isFetching: boolean;
  jobType: IJobType | null;
  error: AxiosError | null;
}>;

type Actions = FetchJobTypeActions | AddJobTypeActions | EditJobTypeActions | DeleteJobTypeActions;

export const initialState: State = {
  isFetching: false,
  jobType: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_JOB_TYPE_REQUEST':
    case 'ADD_JOB_TYPE_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_JOB_TYPE_SUCCESS':
    case 'ADD_JOB_TYPE_SUCCESS':
    case 'EDIT_JOB_TYPE_SUCCESS':
      return {
        isFetching: false,
        jobType: action.payload,
        error: null
      };
    case 'DELETE_JOB_TYPE_SUCCESS':
      return {
        isFetching: false,
        jobType: null,
        error: null
      };
    case 'FETCH_JOB_TYPE_FAILURE':
    case 'ADD_JOB_TYPE_FAILURE':
    case 'EDIT_JOB_TYPE_FAILURE':
    case 'DELETE_JOB_TYPE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
