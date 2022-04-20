import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  editCertification,
  editCertificationFailure,
  editCertificationRequest,
  editCertificationSuccess
} from './editCertification';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, certifications } = fixtures;
const organization = organizations[2];
const certification = certifications[0];
const values = { ...certification, name: 'Welding' };
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ certification: { ...initialState, certification } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('edit certification', () => {
  it('dipatches a success action with the edited certification', async () => {
    axiosMock
      .onPut(`/api/v3.01/organizations(${organization.id})/certifications(${certification.id})`)
      .reply(200, values);
    await store.dispatch(editCertification(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(editCertificationRequest());
    expect(actions[1]).toEqual(editCertificationSuccess(values));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock
        .onPut(`/api/v3.01/organizations(${organization.id})/certifications(${certification.id})`)
        .networkError();
      await store.dispatch(editCertification(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editCertificationRequest());
      expect(actions[1]).toEqual(editCertificationFailure(error));
    }
  });
});
