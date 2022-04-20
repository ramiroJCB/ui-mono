import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteProject,
  deleteProjectFailure,
  deleteProjectRequest,
  deleteProjectSuccess
} from './deleteProject';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, projects } = fixtures;
const organization = organizations[2];
const project = projects[0];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ project: { ...initialState, project } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('delete project', () => {
  it('dipatches only a request action when deleting a project', async () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/projects(${project.id})`).reply(200);
    await store.dispatch(deleteProject(organization.id, project.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteProjectRequest());
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/projects(${project.id})`).networkError();
      await store.dispatch(deleteProject(organization.id, project.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(deleteProjectRequest());
      expect(actions[1]).toEqual(deleteProjectFailure(error));
    }
  });

  it('dispatches a success action', () => {
    store.dispatch(deleteProjectSuccess(project.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteProjectSuccess(project.id));
  });
});
