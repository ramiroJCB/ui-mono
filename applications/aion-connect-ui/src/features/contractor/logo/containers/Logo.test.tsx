import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import MockAdapter from 'axios-mock-adapter';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as logoInitialState } from '../reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { IUploadedLogo } from 'interfaces/uploadedLogo';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { LogoContainer } from './Logo';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, userInfo, error } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);

const response: IUploadedLogo = {
  id: 'd43d747e-274c-4517-a64e-ed30b833e790',
  organizationId: organization.id,
  fileName: 'test.jpg',
  storagePath: 'organization-logo/f2d16e64-25de-4357-add9-b82d1d94ce40.jpg',
  mimeType: 'image/jpeg',
  isDeleted: false
};

const logo = new Blob(['foobar'], { type: 'image/jpg' });
const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  logo: logoInitialState,
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/logo`).reply(200, response);

  axiosMock
    .onGet(`/files/v3.01/organizations(${organization.id})/logo`)
    .reply(200, new Blob(['foobar'], { type: 'image/jpeg' }), { 'content-type': 'image/jpeg' });

  axiosMock.onPost('/spapi/error').reply(200);
});

describe('logo container', () => {
  it('renders a loading spinner right away', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, logo: { ...logoInitialState, isFetching: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={LogoContainer} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(Grid)
      .at(0)
      .simulate('click');

    expect(wrapper.contains(<Loading />)).toBe(true);
  });

  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, logo: { ...logoInitialState, error } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={LogoContainer} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(Grid)
      .at(0)
      .simulate('click');

    expect(wrapper.contains(<Error />)).toBe(true);
  });

  it('renders a logo', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, logo: { ...logoInitialState, logo, metaData: response } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={LogoContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find(Grid)
        .at(0)
        .prop('style')
    ).not.toBeNull();
  });

  it('does not render the logo editor if viewAsClient is true', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, profile: { ...profileInitialState, viewAsClient: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={LogoContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find(Grid).at(0)).toHaveLength(0);
  });
});
