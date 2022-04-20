import { Actions as FetchWorkGroupsActions } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { Actions as AddWorkGroupActions } from '../workGroup/actions/addWorkGroup';
import { Actions as EditWorkGroupActions } from '../workGroup/actions/editWorkGroup';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  workGroups: IWorkGroup[];
  totalCount: number;
  error: AxiosError | null;
}>;

type Actions = FetchWorkGroupsActions | AddWorkGroupActions | EditWorkGroupActions;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  workGroups: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_WORK_GROUPS_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        workGroups: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_WORK_GROUPS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_WORK_GROUPS_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        workGroups: uniqueById(state.workGroups, action.payload).sort((a, b) => a.name.localeCompare(b.name)),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_WORK_GROUPS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_WORK_GROUP_SUCCESS':
    case 'EDIT_WORK_GROUP_SUCCESS':
      return {
        ...state,
        workGroups: [],
        totalCount: 0
      };
    default:
      return state;
  }
}
