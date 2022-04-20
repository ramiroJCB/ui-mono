import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { EditLicenseContainer } from './EditLicense';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IconButton } from '@material-ui/core';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations, licenses } = fixtures;
const organization = organizations[2];
const license = licenses[0];
const axiosMock = new MockAdapter(axios);

it('edits an license', () => {
  axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/licenses(${license.id})`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'put');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route
        path="/organization/:organizationId/connect/profile"
        render={props => <EditLicenseContainer {...props} initialValues={license} />}
      />
    </FakeStoreAndRouter>
  );

  const name = 'Welding';
  wrapper.find(IconButton).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: name } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/licenses(${license.id})`, {
    ...license,
    name
  });
});
