import { error, projects } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';
import { IProject } from '../../../interfaces/project';

let prevState: State;
const project = projects[0];

beforeEach(() => {
  prevState = initialState;
});

describe('project reducer', () => {
  it('should update state correctly when dispatching FETCH_PROJECTS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_PROJECTS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_PROJECTS_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_PROJECTS_SUCCESS',
      payload: projects
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.projects).toEqual(projects);
  });

  it('should update state correctly when dispatching ADD_PROJECT_SUCCESS', () => {
    const newProject: IProject = {
      id: '3e388408-4c4a-4ace-ab84-25b2e0414c7e',
      name: 'Welding',
      startDateUtc: '2017-01-02T03:00:00Z',
      endDateUtc: '2017-01-02T03:00:00Z',
      isActive: false,
      description: 'Foobar',
      organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
      isDeleted: false
    };

    const nextState = reducer(prevState, {
      type: 'ADD_PROJECT_SUCCESS',
      payload: newProject
    });

    expect(nextState.projects).toEqual(
      [newProject, ...prevState.projects].sort((a, b) =>
        a.endDateUtc && b.endDateUtc ? +new Date(b.endDateUtc) - +new Date(a.endDateUtc) : +b.isActive - +a.isActive
      )
    );
  });

  it('should update state correctly when dispatching EDIT_PROJECT_SUCCESS', () => {
    const editedProject: IProject = { ...project, name: 'Welding' };

    prevState = reducer(prevState, {
      type: 'FETCH_PROJECTS_SUCCESS',
      payload: projects
    });

    const nextState = reducer(prevState, {
      type: 'EDIT_PROJECT_SUCCESS',
      payload: editedProject
    });

    expect(nextState.projects).toEqual(
      prevState.projects.map(project => (project.id === editedProject.id ? editedProject : project))
    );
  });

  it('should update state correctly when dispatching DELETE_PROJECT_SUCCESS', () => {
    prevState = reducer(prevState, {
      type: 'FETCH_PROJECTS_SUCCESS',
      payload: projects
    });

    const nextState = reducer(prevState, {
      type: 'DELETE_PROJECT_SUCCESS',
      payload: project.id
    });

    expect(nextState.projects).toEqual(projects.filter(({ id }) => id !== project.id));
  });

  it('should update state correctly when dispatching FETCH_PROJECTS_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_PROJECTS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
