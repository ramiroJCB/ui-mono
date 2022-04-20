import * as fixtures from '@pec/aion-ui-core/fixtures';
import * as React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import MockAdapter from 'axios-mock-adapter';
import { AddReferenceContainer } from './AddReference';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IReferenceForm } from 'interfaces/referenceForm';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);

it('submits a reference', () => {
  const values: IReferenceForm = {
    name: 'Fox Mulder',
    phoneNumber: '9856965555',
    emailAddress: 'foxySmoler@hottmail.com',
    notes:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  };

  axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/references`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'post');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route path="/organization/:organizationId/connect/profile" component={AddReferenceContainer} />
    </FakeStoreAndRouter>
  );

  wrapper.find(Button).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: values.name } });
  wrapper.find('input[name="phoneNumber"]').simulate('change', { target: { value: values.phoneNumber } });
  wrapper.find('input[name="emailAddress"]').simulate('change', { target: { value: values.emailAddress } });
  wrapper.find('textarea[name="notes"]').simulate('change', { target: { value: values.notes } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/references`, values);
});
