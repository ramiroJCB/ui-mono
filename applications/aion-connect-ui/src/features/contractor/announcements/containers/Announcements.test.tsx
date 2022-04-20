import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AnnouncementsContainer } from './Announcements';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { EditAnnouncementContainer } from 'features/contractor/announcements/containers/EditAnnouncement';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as announcementInitialState } from '../reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';

const { organizations, announcements, userInfo, error } = fixtures;
const organization = organizations[2];
const announcement = announcements[0];
const axiosMock = new MockAdapter(axios);
const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  announcement: announcementInitialState,
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock
    .onGet(`/api/v3.01/organizations(${organization.id})/announcements`)
    .reply(200, { '@odata.count': announcements.length, value: announcements });
  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('announcement container', () => {
  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, announcement: { ...announcementInitialState, error } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={AnnouncementsContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Error message="There was an error processing your request." />)).toBe(true);
  });

  it('renders the announcement', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, announcement: { ...announcementInitialState, announcement } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={AnnouncementsContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find('p')
        .at(2)
        .text()
    ).toEqual(announcement.text);
  });

  it('deletes the announcement', () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/announcements(${announcement.id})`).reply(200);

    const axiosSpy = jest.spyOn(axios, 'delete');
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, announcement: { ...announcementInitialState, announcement } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={AnnouncementsContainer} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(ConfirmDelete)
      .at(0)
      .simulate('click');

    wrapper.find(LoadingButton).simulate('click');

    expect(axiosSpy).toHaveBeenCalledWith(
      `/api/v3.01/organizations(${organization.id})/announcements(${announcement.id})`
    );
  });

  it('does not render the edit announcement container if viewAsClient is true', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, profile: { ...profileInitialState, viewAsClient: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={AnnouncementsContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<EditAnnouncementContainer initialValues={{ ...announcement }} />)).toBeFalsy();
  });
});
