import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  fetchAnnouncement,
  fetchAnnouncementFailure,
  fetchAnnouncementRequest,
  fetchAnnouncementSuccess
} from './fetchAnnouncement';
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

describe('fetch announcement', () => {
  it('dipatches a success action with the announcement', async () => {
    axiosMock
      .onGet(`/api/v3.01/organizations(${organization.id})/announcements`)
      .reply(200, { '@odata.count': announcements.length, value: announcements });
    await store.dispatch(fetchAnnouncement(organization.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(fetchAnnouncementRequest());
    expect(actions[1]).toEqual(fetchAnnouncementSuccess(announcement));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/announcements`).networkError();
      await store.dispatch(fetchAnnouncement(organization.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(fetchAnnouncementRequest());
      expect(actions[1]).toEqual(fetchAnnouncementFailure(error));
    }
  });
});
