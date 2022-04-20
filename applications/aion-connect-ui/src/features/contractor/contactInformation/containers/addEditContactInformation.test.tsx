import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AddEditContactInformationContainer } from './AddEditContactInformation';
import { Button, IconButton } from '@material-ui/core';
import { ContactType } from 'interfaces/contactInformation';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IContactInformationForm } from 'interfaces/contactInformationForm';
import { initialState as contactInformationInitialState } from '../reducer';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, contactInformation } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);
const state = { contactInformation: contactInformationInitialState };

describe('add edit contact information container', () => {
  it('adds an organizations contact information', () => {
    const values: IContactInformationForm = {
      type: ContactType.Primary,
      phoneNumber: '9856965555',
      emailAddress: 'test@test.com',
      websiteUrl: 'https://test.com'
    };

    axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/contactInformation`).reply(200, { value: [] });
    axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/contactInformation`).reply(200);

    const axiosSpy = jest.spyOn(axios, 'post');
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={state}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={AddEditContactInformationContainer} />
      </FakeStoreAndRouter>
    );

    wrapper.find(Button).simulate('click');
    wrapper.find('input[name="phoneNumber"]').simulate('change', { target: { value: values.phoneNumber } });
    wrapper.find('input[name="emailAddress"]').simulate('change', { target: { value: values.emailAddress } });
    wrapper.find('input[name="websiteUrl"]').simulate('change', { target: { value: values.websiteUrl } });
    wrapper.find('form').simulate('submit');

    expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/contactInformation`, values);
  });

  it('edits an organizations contact information', () => {
    axiosMock
      .onGet(`/api/v3.01/organizations(${organization.id})/contactInformation`)
      .reply(200, { value: contactInformation });

    axiosMock
      .onPut(`/api/v3.01/organizations(${organization.id})/contactInformation(${contactInformation.id})`)
      .reply(200, contactInformation);

    const axiosSpy = jest.spyOn(axios, 'put');
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ contactInformation: { ...contactInformationInitialState, contactInformation } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={AddEditContactInformationContainer} />
      </FakeStoreAndRouter>
    );

    const phoneNumber = '0001115555';
    wrapper.find(IconButton).simulate('click');
    wrapper.find('input[name="phoneNumber"]').simulate('change', { target: { value: phoneNumber } });
    wrapper.find('form').simulate('submit');

    expect(axiosSpy).toHaveBeenCalledWith(
      `/api/v3.01/organizations(${organization.id})/contactInformation(${contactInformation.id})`,
      {
        ...contactInformation,
        phoneNumber
      }
    );
  });
});
