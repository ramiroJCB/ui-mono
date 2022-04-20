import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteCertification,
  deleteCertificationFailure,
  deleteCertificationRequest,
  deleteCertificationSuccess
} from './deleteCertification';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, certifications } = fixtures;
const organization = organizations[2];
const certification = certifications[0];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ certification: { ...initialState, certification } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('delete certification', () => {
  it('dipatches only a request action when deleting a certification', async () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/certifications(${certification.id})`).reply(200);
    await store.dispatch(deleteCertification(organization.id, certification.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteCertificationRequest());
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock
        .onDelete(`/api/v3.01/organizations(${organization.id})/certifications(${certification.id})`)
        .networkError();
      await store.dispatch(deleteCertification(organization.id, certification.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(deleteCertificationRequest());
      expect(actions[1]).toEqual(deleteCertificationFailure(error));
    }
  });

  it('dispatches a success action', () => {
    store.dispatch(deleteCertificationSuccess(certification.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteCertificationSuccess(certification.id));
  });
});
