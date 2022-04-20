import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ContactInformationContainer } from './ContactInformation';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as contactInformationInitialState } from '../reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, userInfo, contactInformation } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);
const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  contactInformation: { ...contactInformationInitialState, contactInformation },
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock
    .onGet(`/api/v3.01/organizations(${organization.id})/contactInformation`)
    .reply(200, { value: contactInformation });
});

it('renders the contact information', () => {
  const wrapper = mount(
    <FakeStoreAndRouter<Partial<RootState>>
      state={state}
      initialEntries={[`/organization/${organization.id}/connect/profile`]}
    >
      <Route path="/organization/:organizationId/connect/profile" component={ContactInformationContainer} />} />
    </FakeStoreAndRouter>
  );

  expect(
    wrapper
      .find('a')
      .at(0)
      .text()
  ).toEqual(contactInformation.emailAddress);
});
