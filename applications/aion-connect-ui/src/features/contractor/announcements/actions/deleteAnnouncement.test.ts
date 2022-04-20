import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteAnnouncement,
  deleteAnnouncementFailure,
  deleteAnnouncementRequest,
  deleteAnnouncementSuccess
} from './deleteAnnouncement';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, announcements } = fixtures;
const organization = organizations[2];
const announcement = announcements[0];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ announcement: { ...initialState, announcement } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('delete announcement', () => {
  it('dipatches a success action when deleting a announcement', async () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/announcements(${announcement.id})`).reply(200);
    await store.dispatch(deleteAnnouncement(organization.id, announcement.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteAnnouncementRequest());
    expect(actions[1]).toEqual(deleteAnnouncementSuccess());
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock
        .onDelete(`/api/v3.01/organizations(${organization.id})/announcements(${announcement.id})`)
        .networkError();
      await store.dispatch(deleteAnnouncement(organization.id, announcement.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(deleteAnnouncementRequest());
      expect(actions[1]).toEqual(deleteAnnouncementFailure(error));
    }
  });
});
