import { Actions as fetchWorkGroupJobTypesActions } from './actions/fetchWorkGroupJobTypes';
import { Actions as addWorkGroupJobTypesActions } from './actions/addWorkGroupJobTypes';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetching: boolean;
  isFetchingInitial: boolean;
  workGroupJobTypes: IWorkGroupJobType[];
  totalCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  workGroupJobTypes: [],
  totalCount: 0,
  error: null
};

type Actions = fetchWorkGroupJobTypesActions | addWorkGroupJobTypesActions;

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_WORK_GROUP_JOB_TYPES_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        workGroupJobTypes: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPES_REQUEST':
    case 'ADD_WORK_GROUP_JOB_TYPES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        isFetchingInitial: false,
        workGroupJobTypes: uniqueById(state.workGroupJobTypes, action.payload).sort((a, b) =>
          a.jobTypeName.localeCompare(b.jobTypeName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'ADD_WORK_GROUP_JOB_TYPES_FAILURE':
    case 'FETCH_WORK_GROUP_JOB_TYPES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
