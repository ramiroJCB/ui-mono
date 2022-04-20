import { Actions as FetchProjectsActions } from './actions';
import { Actions as AddProjectActions } from '../project/actions/addProject';
import { Actions as EditProjectActions } from '../project/actions/editProject';
import { Actions as DeleteProjectActions } from '../project/actions/deleteProject';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IProject } from 'interfaces/project';

export type State = DeepReadonly<{
  isFetching: boolean;
  projects: IProject[];
  error: AxiosError | null;
}>;

type Actions = FetchProjectsActions | AddProjectActions | EditProjectActions | DeleteProjectActions;

export const initialState: State = {
  isFetching: false,
  projects: [],
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_PROJECTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_PROJECTS_SUCCESS':
      return {
        isFetching: false,
        projects: action.payload,
        error: null
      };
    case 'ADD_PROJECT_SUCCESS':
      return {
        ...state,
        projects: [action.payload, ...state.projects].sort((a, b) =>
          a.endDateUtc && b.endDateUtc ? +new Date(b.endDateUtc) - +new Date(a.endDateUtc) : +b.isActive - +a.isActive
        )
      };
    case 'EDIT_PROJECT_SUCCESS':
      return {
        ...state,
        projects: state.projects.map(project => (project.id === action.payload.id ? action.payload : project))
      };
    case 'DELETE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: state.projects.filter(({ id }) => id !== action.payload)
      };
    case 'FETCH_PROJECTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
