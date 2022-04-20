import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  editAnnouncement,
  editAnnouncementFailure,
  editAnnouncementRequest,
  editAnnouncementSuccess
} from './editAnnouncement';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, announcements } = fixtures;
const organization = organizations[2];
const announcement = announcements[0];
const values = {
  ...announcement,
  text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ announcement: { ...initialState, announcement } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('edit announcement', () => {
  it('dipatches a success action with the edited announcement', async () => {
    axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/announcements(${values.id})`).reply(200, values);
    await store.dispatch(editAnnouncement(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(editAnnouncementRequest());
    expect(actions[1]).toEqual(editAnnouncementSuccess(values));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/announcements(${values.id})`).networkError();
      await store.dispatch(editAnnouncement(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editAnnouncementRequest());
      expect(actions[1]).toEqual(editAnnouncementFailure(error));
    }
  });
});
