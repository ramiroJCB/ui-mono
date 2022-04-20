import * as fixtures from '@pec/aion-ui-core/fixtures';
import * as React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import MockAdapter from 'axios-mock-adapter';
import { AddAccreditationContainer } from './AddAccreditation';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IAccreditationForm } from 'interfaces/accreditationForm';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);

it('submits an accreditation', () => {
  const values: IAccreditationForm = {
    name: 'Safe Work Assurance',
    issueDateUtc: '2018-09-15T03:00:00Z',
    accreditationId: 'SWA-861-TCH'
  };

  axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/accreditations`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'post');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route path="/organization/:organizationId/connect/profile" component={AddAccreditationContainer} />
    </FakeStoreAndRouter>
  );

  wrapper.find(Button).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: values.name } });
  wrapper
    .find(DateField)
    .at(0)
    .props()
    .input.onChange(values.issueDateUtc);
  wrapper.find('input[name="accreditationId"]').simulate('change', { target: { value: values.accreditationId } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/accreditations`, values);
});
