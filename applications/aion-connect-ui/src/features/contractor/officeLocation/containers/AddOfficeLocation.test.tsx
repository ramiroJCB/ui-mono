import * as fixtures from '@pec/aion-ui-core/fixtures';
import * as React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import MockAdapter from 'axios-mock-adapter';
import { AddOfficeLocationContainer } from './AddOfficeLocation';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IOfficeLocationForm } from 'interfaces/officeLocationForm';
import { mount } from 'enzyme';
import { OfficeLocationType } from 'interfaces/officeLocation';
import { Route } from 'react-router-dom';
import { SelectFieldComponent } from '@pec/aion-ui-form/components/Autocomplete/SelectField';

const { organizations } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);

it('submits a office location', () => {
  const values: IOfficeLocationForm = {
    type: OfficeLocationType.AdditionalOffice,
    name: 'Main Office',
    streetAddress: '123 Industrial Dr',
    city: 'Mandeville',
    state: { value: 'LA', label: 'Louisiana' },
    postalCode: '70470'
  };

  axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/officeLocations`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'post');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route path="/organization/:organizationId/connect/profile" component={AddOfficeLocationContainer} />
    </FakeStoreAndRouter>
  );

  wrapper.find(Button).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: values.name } });
  wrapper.find('input[name="streetAddress"]').simulate('change', { target: { value: values.streetAddress } });
  wrapper.find('input[name="city"]').simulate('change', { target: { value: values.city } });
  wrapper
    .find(SelectFieldComponent)
    .props()
    .input.onChange(values.state);
  wrapper.find('input[name="postalCode"]').simulate('change', { target: { value: values.postalCode } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/officeLocations`, {
    ...values,
    state: values.state!.value
  });
});
