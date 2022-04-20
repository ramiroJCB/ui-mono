import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { EditDescriptionContainer } from './EditDescription';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IconButton } from '@material-ui/core';
import { initialState } from '@pec/aion-ui-core/reducers/organization';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations } = fixtures;
const organization = organizations[1];
const axiosMock = new MockAdapter(axios);
const value = { description: 'All the best things' };
const state = { organization: { ...initialState, organization } };

it('edits an organization description', () => {
  axiosMock.onPatch(`/api/v2/organizations/${organization.id}`).reply(200, value);

  const axiosSpy = jest.spyOn(axios, 'patch');
  const wrapper = mount(
    <FakeStoreAndRouter<Partial<RootState>>
      state={state}
      initialEntries={[`/organization/${organization.id}/connect/profile`]}
    >
      <Route path="/organization/:organizationId/connect/profile" component={EditDescriptionContainer} />
    </FakeStoreAndRouter>
  );

  const description = 'All the best things';
  wrapper.find(IconButton).simulate('click');
  wrapper.find('textarea').simulate('change', { target: { value: description } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v2/organizations/${organization.id}`, [
    {
      op: 'replace',
      path: '/description',
      value: 'All the best things'
    }
  ]);
});
