import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { EditOfficeLocationContainer } from './EditOfficeLocation';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IconButton } from '@material-ui/core';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations, officeLocations } = fixtures;
const organization = organizations[2];
const officeLocation = officeLocations[0];
const axiosMock = new MockAdapter(axios);

it('edits an office location', () => {
  axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/officeLocations(${officeLocation.id})`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'put');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route
        path="/organization/:organizationId/connect/profile"
        render={props => (
          <EditOfficeLocationContainer
            {...props}
            initialValues={{ ...officeLocation, state: { value: 'LA', label: 'Louisiana ' } }}
          />
        )}
      />
    </FakeStoreAndRouter>
  );

  const name = 'Secondary Office';
  wrapper.find(IconButton).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: name } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(
    `/api/v3.01/organizations(${organization.id})/officeLocations(${officeLocation.id})`,
    {
      ...officeLocation,
      name
    }
  );
});
