import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { EditReferenceContainer } from './EditReference';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IconButton } from '@material-ui/core';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations, references } = fixtures;
const organization = organizations[2];
const reference = references[0];
const axiosMock = new MockAdapter(axios);

it('edits an reference', () => {
  axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/references(${reference.id})`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'put');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route
        path="/organization/:organizationId/connect/profile"
        render={props => <EditReferenceContainer {...props} initialValues={reference} />}
      />
    </FakeStoreAndRouter>
  );

  const name = 'Dana Scully';
  wrapper.find(IconButton).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: name } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/references(${reference.id})`, {
    ...reference,
    name
  });
});
