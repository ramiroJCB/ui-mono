import * as fixtures from '@pec/aion-ui-core/fixtures';
import * as React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import MockAdapter from 'axios-mock-adapter';
import { AddLicenseContainer } from './AddLicense';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { ILicenseForm } from 'interfaces/licenseForm';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);

it('submits a license', () => {
  const values: ILicenseForm = {
    name: 'Pipefitting',
    issueDateUtc: '2018-09-15T03:00:00Z',
    licenseId: '385308A83-01'
  };

  axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/licenses`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'post');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route path="/organization/:organizationId/connect/profile" component={AddLicenseContainer} />
    </FakeStoreAndRouter>
  );

  wrapper.find(Button).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: values.name } });
  wrapper
    .find(DateField)
    .at(0)
    .props()
    .input.onChange(values.issueDateUtc);
  wrapper.find('input[name="licenseId"]').simulate('change', { target: { value: values.licenseId } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/licenses`, values);
});
