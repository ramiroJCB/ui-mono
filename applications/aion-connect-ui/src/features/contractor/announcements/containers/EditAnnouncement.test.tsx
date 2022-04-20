import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Button } from '@material-ui/core';
import { EditAnnouncementContainer } from './EditAnnouncement';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';

const { organizations, announcements } = fixtures;
const organization = organizations[2];
const announcement = announcements[0];
const axiosMock = new MockAdapter(axios);

it('edits the announcement', () => {
  axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/announcements(${announcement.id})`).reply(200);

  const axiosSpy = jest.spyOn(axios, 'put');
  const wrapper = mount(
    <FakeStoreAndRouter initialEntries={[`/organization/${organization.id}/connect/profile`]}>
      <Route
        path="/organization/:organizationId/connect/profile"
        render={props => <EditAnnouncementContainer {...props} initialValues={announcement} />}
      />
    </FakeStoreAndRouter>
  );

  const text =
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  wrapper.find(Button).simulate('click');
  wrapper.find('textarea[name="text"]').simulate('change', { target: { value: text } });
  wrapper.find('form').simulate('submit');

  expect(axiosSpy).toHaveBeenCalledWith(
    `/api/v3.01/organizations(${organization.id})/announcements(${announcement.id})`,
    {
      ...announcement,
      text
    }
  );
});
