import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AddProjectContainer } from 'features/contractor/project/containers/AddProject';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as projectsInitialState } from '../reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { mount } from 'enzyme';
import { ProjectsContainer } from './Projects';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, projects, userInfo, error } = fixtures;
const organization = organizations[2];
const project = projects[0];
const axiosMock = new MockAdapter(axios);
const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  projects: projectsInitialState,
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/projects`).reply(200, projects);
  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('projects container', () => {
  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, projects: { ...projectsInitialState, error } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ProjectsContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Error message="There was an error processing your request." />)).toBe(true);
  });

  it('renders some projects', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, projects: { ...projectsInitialState, projects } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ProjectsContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find('h6')
        .at(0)
        .text()
    ).toEqual(project.name);
  });

  it('renders a present project', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, projects: { ...projectsInitialState, projects } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ProjectsContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find('p')
        .at(5)
        .text()
    ).toEqual('01/2017 to Present');
  });

  it('deletes a project', () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/projects(${project.id})`).reply(200);

    const axiosSpy = jest.spyOn(axios, 'delete');
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, projects: { ...projectsInitialState, projects } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ProjectsContainer} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(ConfirmDelete)
      .at(0)
      .simulate('click');

    wrapper.find(LoadingButton).simulate('click');

    expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/projects(${project.id})`);
  });

  it('does not render the add project container if viewAsClient is true', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, profile: { ...profileInitialState, viewAsClient: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ProjectsContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<AddProjectContainer />)).toBeFalsy();
  });
});
