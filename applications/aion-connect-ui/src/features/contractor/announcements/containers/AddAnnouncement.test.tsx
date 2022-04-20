import * as fixtures from '@pec/aion-ui-core/fixtures';
import * as React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import MockAdapter from 'axios-mock-adapter';
import { AddAnnouncementContainer } from './AddAnnouncement';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IAnnouncementForm } from 'interfaces/announcementForm';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations } = fixtures;
const organization = organizations[2];
const axiosMock = new MockAdapter(axios);
it('submits a announcement', () => {
  const values: IAnnouncementForm = {
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  };

  axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/announcements`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'post');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route path="/organization/:organizationId/connect/profile" component={AddAnnouncementContainer} />
    </FakeStoreAndRouter>
  );

  wrapper.find(Button).simulate('click');
  wrapper.find('textarea[name="text"]').simulate('change', { target: { value: values.text } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/announcements`, values);
});
