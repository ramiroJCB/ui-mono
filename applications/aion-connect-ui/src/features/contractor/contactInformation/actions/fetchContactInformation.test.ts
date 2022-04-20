import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  fetchContactInformation,
  fetchContactInformationFailure,
  fetchContactInformationRequest,
  fetchContactInformationSuccess
} from './fetchContactInformation';
import { ContactType } from 'interfaces/contactInformation';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const { Primary } = ContactType;
const response = {
  value: [
    {
      phoneNumber: '1112223333',
      websiteUrl: 'http://www.wework.com',
      id: 'd34acb83-4164-4395-bc86-b01171429eaa',
      type: Primary,
      emailAddress: 'barrywhite@email.com',
      isDeleted: false,
      organizationId: organization.id
    }
  ]
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ contactInformation: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('fetch contact information', () => {
  it('fetches contact information successfully with a record', async () => {
    axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/contactInformation`).reply(200, response);
    await store.dispatch(fetchContactInformation(organization.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(fetchContactInformationRequest());
    expect(actions[1]).toEqual(fetchContactInformationSuccess(response.value[0]));
  });

  it('fails to fetch contact information', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/contactInformation`).networkError();
      await store.dispatch(fetchContactInformation(organization.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(fetchContactInformationRequest());
      expect(actions[1]).toEqual(fetchContactInformationFailure(error));
    }
  });
});
