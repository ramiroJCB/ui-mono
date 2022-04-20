import { Actions as AddProjectActions } from './actions/addProject';
import { Actions as DeleteProjectActions } from './actions/deleteProject';
import { Actions as EditProjectActions } from './actions/editProject';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IProject } from 'interfaces/project';

export type State = DeepReadonly<{
  isFetching: boolean;
  project: IProject | null;
  error: AxiosError | null;
}>;

type Actions = AddProjectActions | EditProjectActions | DeleteProjectActions;

export const initialState: State = {
  isFetching: false,
  project: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_PROJECT_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_PROJECT_SUCCESS':
    case 'EDIT_PROJECT_SUCCESS':
      return {
        isFetching: false,
        project: action.payload,
        error: null
      };
    case 'DELETE_PROJECT_SUCCESS':
      return {
        isFetching: false,
        project: null,
        error: null
      };
    case 'ADD_PROJECT_FAILURE':
    case 'EDIT_PROJECT_FAILURE':
    case 'DELETE_PROJECT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
