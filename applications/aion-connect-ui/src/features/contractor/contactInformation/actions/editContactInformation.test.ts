import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  editContactInformation,
  editContactInformationFailure,
  editContactInformationRequest,
  editContactInformationSuccess
} from './editContactInformation';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, contactInformation } = fixtures;
const organization = organizations[2];
const values = { ...contactInformation, phoneNumber: '5554443333' };
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ contactInformation: { ...initialState, contactInformation } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('edit contact information', () => {
  it('edits contact information successfully', async () => {
    axiosMock
      .onPut(`/api/v3.01/organizations(${organization.id})/contactInformation(${contactInformation.id})`)
      .reply(200, values);
    await store.dispatch(editContactInformation(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(editContactInformationRequest());
    expect(actions[1]).toEqual(editContactInformationSuccess(values));
  });

  it('fails to update contact information', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock
        .onPut(`/api/v3.01/organizations(${organization.id})/contactInformation(${contactInformation.id})`)
        .networkError();
      await store.dispatch(editContactInformation(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editContactInformationRequest());
      expect(actions[1]).toEqual(editContactInformationFailure(error));
    }
  });
});
