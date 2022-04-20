import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Actions, editProject, editProjectFailure, editProjectRequest, editProjectSuccess } from './editProject';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, projects } = fixtures;
const organization = organizations[2];
const project = projects[0];
const values = { ...project, name: 'Welding' };
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<Partial<RootState>, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ project: { ...initialState, project } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('edit project', () => {
  it('dipatches a success action with the edited project', async () => {
    axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/projects(${project.id})`).reply(200, values);
    await store.dispatch(editProject(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(editProjectRequest());
    expect(actions[1]).toEqual(editProjectSuccess(values));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/projects(${project.id})`).networkError();
      await store.dispatch(editProject(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editProjectRequest());
      expect(actions[1]).toEqual(editProjectFailure(error));
    }
  });
});
