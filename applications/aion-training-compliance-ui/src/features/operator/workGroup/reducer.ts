import { Actions as AddWorkGroupActions } from './actions/addWorkGroup';
import { Actions as FetchWorkGroupActions } from './actions/fetchWorkGroup';
import { Actions as EditWorkGroupActions } from './actions/editWorkGroup';
import { Actions as DeleteWorkGroupActions } from './actions/deleteWorkGroup';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';

export type State = DeepReadonly<{
  isFetching: boolean;
  workGroup: IWorkGroup | null;
  error: AxiosError | null;
}>;

type Actions = AddWorkGroupActions | FetchWorkGroupActions | EditWorkGroupActions | DeleteWorkGroupActions;

export const initialState: State = {
  isFetching: false,
  workGroup: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_WORK_GROUP_REQUEST':
    case 'FETCH_WORK_GROUP_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'DELETE_WORK_GROUP_SUCCESS':
      return {
        isFetching: false,
        workGroup: null,
        error: null
      };
    case 'ADD_WORK_GROUP_SUCCESS':
    case 'FETCH_WORK_GROUP_SUCCESS':
    case 'EDIT_WORK_GROUP_SUCCESS':
      return {
        isFetching: false,
        workGroup: action.payload,
        error: null
      };
    case 'ADD_WORK_GROUP_FAILURE':
    case 'FETCH_WORK_GROUP_FAILURE':
    case 'EDIT_WORK_GROUP_FAILURE':
    case 'DELETE_WORK_GROUP_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
