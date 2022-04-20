import { error, projects } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const project = projects[0];

beforeEach(() => {
  prevState = initialState;
});

describe('project reducer', () => {
  it('should update state correctly when dispatching ADD_PROJECT_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_PROJECT_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching ADD_PROJECT_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_PROJECT_SUCCESS',
      payload: project
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.project).toEqual(project);
  });

  it('should update state correctly when dispatching EDIT_PROJECT_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_PROJECT_SUCCESS',
      payload: project
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.project).toEqual(project);
  });

  it('should update state correctly when dispatching DELETE_PROJECT_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_PROJECT_SUCCESS',
      payload: project.id
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.project).toBeNull();
  });

  it('should update state correctly when dispatching ADD_PROJECT_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_PROJECT_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching EDIT_PROJECT_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_PROJECT_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching DELETE_PROJECT_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_PROJECT_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
