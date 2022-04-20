import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  addAnnouncement,
  addAnnouncementFailure,
  addAnnouncementRequest,
  addAnnouncementSuccess
} from './addAnnouncement';
import { IAnnouncement } from 'interfaces/announcement';
import { IAnnouncementForm } from 'interfaces/announcementForm';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const values: IAnnouncementForm = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
};

const response: IAnnouncement = {
  ...values,
  id: '65ff3eaa-fe54-41be-a985-a7af86cef0f4',
  updatedDateUtc: '2020-01-18T03:00:00Z',
  organizationId: organization.id,
  isDeleted: false
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ announcement: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('add announcement', () => {
  it('dipatches a success action with the newly created announcement', async () => {
    axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/announcements`).reply(200, response);
    await store.dispatch(addAnnouncement(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addAnnouncementRequest());
    expect(actions[1]).toEqual(addAnnouncementSuccess(response));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/announcements`).networkError();
      await store.dispatch(addAnnouncement(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addAnnouncementRequest());
      expect(actions[1]).toEqual(addAnnouncementFailure(error));
    }
  });
});
