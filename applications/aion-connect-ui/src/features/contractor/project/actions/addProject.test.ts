import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Actions, addProject, addProjectFailure, addProjectRequest, addProjectSuccess } from './addProject';
import { initialState } from '../reducer';
import { IProject } from 'interfaces/project';
import { IProjectForm } from 'interfaces/projectForm';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const values: IProjectForm = {
  name: 'Pipelines',
  startDateUtc: '2020-01-22T15:55:01.426Z',
  endDateUtc: '2020-06-22T15:55:01.426Z',
  isActive: false,
  description: 'This is a description.'
};

const response: IProject = {
  ...values,
  id: 'd34acb83-4164-4395-bc86-b01171429eaa',
  isDeleted: false,
  organizationId: organization.id
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ project: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('add project', () => {
  it('dipatches a success action with the newly created project', async () => {
    axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/projects`).reply(200, response);
    await store.dispatch(addProject(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addProjectRequest());
    expect(actions[1]).toEqual(addProjectSuccess(response));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/projects`).networkError();
      await store.dispatch(addProject(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addProjectRequest());
      expect(actions[1]).toEqual(addProjectFailure(error));
    }
  });
});
