import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AddLicenseContainer } from 'features/contractor/license/containers/AddLicense';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as licensesInitialState } from '../reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { LicensesContainer } from './Licenses';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, licenses, userInfo, error } = fixtures;
const organization = organizations[2];
const license = licenses[0];
const axiosMock = new MockAdapter(axios);
const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  licenses: licensesInitialState,
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/licenses`).reply(200, licenses);
  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('licenses container', () => {
  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, licenses: { ...licensesInitialState, error } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={LicensesContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Error message="There was an error processing your request." />)).toBe(true);
  });

  it('renders an some licenses', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, licenses: { ...licensesInitialState, licenses } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={LicensesContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find('td')
        .at(0)
        .text()
    ).toEqual(license.name);
  });

  it('deletes a license', () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/licenses(${license.id})`).reply(200);

    const axiosSpy = jest.spyOn(axios, 'delete');
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, licenses: { ...licensesInitialState, licenses } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={LicensesContainer} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(ConfirmDelete)
      .at(0)
      .simulate('click');

    wrapper.find(LoadingButton).simulate('click');

    expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/licenses(${license.id})`);
  });

  it('does not render the add license container if viewAsClient is true', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, profile: { ...profileInitialState, viewAsClient: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={LicensesContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<AddLicenseContainer />)).toBeFalsy();
  });
});
