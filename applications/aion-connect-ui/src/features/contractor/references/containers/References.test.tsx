import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Typography from '@material-ui/core/Typography';
import { AddReferenceContainer } from 'features/contractor/reference/containers/AddReference';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as referencesInitialState } from '../reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { IReference } from 'interfaces/reference';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { mount } from 'enzyme';
import { ReferencesContainer } from './References';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, references, userInfo, error } = fixtures;
const organization = organizations[2];
const reference = references[0];
const axiosMock = new MockAdapter(axios);
const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  references: referencesInitialState,
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/references`).reply(200, references);
  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('references container', () => {
  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, references: { ...referencesInitialState, error } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ReferencesContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Error message="There was an error processing your request." />)).toBe(true);
  });

  it('renders an some references', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, references: { ...referencesInitialState, references } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ReferencesContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find('td')
        .at(0)
        .text()
    ).toEqual(reference.name);
  });

  it('shows an message when they add 10 references', () => {
    const tenReferences: IReference[] = [];

    for (let i = 0; i <= 10; i++) {
      tenReferences.push(reference);
    }

    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, references: { ...referencesInitialState, references: tenReferences } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ReferencesContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find(Typography)
        .at(2)
        .text()
    ).toEqual('Reference amount of 10 has been exceeded.');
  });

  it('deletes a reference', () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/references(${reference.id})`).reply(200);

    const axiosSpy = jest.spyOn(axios, 'delete');
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, references: { ...referencesInitialState, references } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ReferencesContainer} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(ConfirmDelete)
      .at(0)
      .simulate('click');

    wrapper.find(LoadingButton).simulate('click');

    expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/references(${reference.id})`);
  });

  it('does not render the add reference container if viewAsClient is true', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, profile: { ...profileInitialState, viewAsClient: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={ReferencesContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<AddReferenceContainer />)).toBeFalsy();
  });
});
