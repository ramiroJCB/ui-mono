import * as fixtures from '@pec/aion-ui-core/fixtures';
import * as React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import MockAdapter from 'axios-mock-adapter';
import { AddTradeNameContainer } from './AddTradeName';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { ITradeNameForm } from 'interfaces/tradeNameForm';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);

it('submits a trade name', () => {
  const values: ITradeNameForm = {
    name: 'Initech Technology Solutions',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  };

  axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/tradeNames`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'post');
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        organization: { isFetching: true, organization, fetchError: null },
        tradeName: { isFetching: true, tradeName: null, error: null }
      }}
      initialEntries={[`/organization/${organization.id}/connect/profile`]}
    >
      <Route path="/organization/:organizationId/connect/profile" component={AddTradeNameContainer} />
    </FakeStoreAndRouter>
  );

  wrapper.find(Button).simulate('click');
  wrapper.find('input[name="name"]').simulate('change', { target: { value: values.name } });
  wrapper.find('textarea[name="description"]').simulate('change', { target: { value: values.description } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/tradeNames`, values);
});
