import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { EditTradeNameContainer } from './EditTradeName';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IconButton } from '@material-ui/core';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations, tradeNames } = fixtures;
const organization = organizations[2];
const tradeName = tradeNames[0];
const axiosMock = new MockAdapter(axios);

it('edits an trade name', () => {
  axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/tradeNames(${tradeName.id})`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'put');
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        organization: { isFetching: true, organization, fetchError: null },
        tradeName: { isFetching: true, tradeName: null, error: null }
      }}
      initialEntries={[`/organization/${organization.id}/connect/profile`]}
    >
      <Route
        path="/organization/:organizationId/connect/profile"
        render={props => <EditTradeNameContainer {...props} initialValues={tradeName} />}
      />
    </FakeStoreAndRouter>
  );

  const name = 'Initech Technology';
  wrapper.find(IconButton).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: name } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/tradeNames(${tradeName.id})`, {
    ...tradeName,
    name
  });
});
