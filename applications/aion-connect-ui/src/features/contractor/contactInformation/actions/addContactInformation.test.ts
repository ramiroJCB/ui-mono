import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  addContactInformation,
  addContactInformationFailure,
  addContactInformationRequest,
  addContactInformationSuccess
} from './addContactInformation';
import { ContactType, IContactInformation } from 'interfaces/contactInformation';
import { IContactInformationForm } from 'interfaces/contactInformationForm';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { Primary } = ContactType;
const { organizations } = fixtures;
const organization = organizations[2];
const values: IContactInformationForm = {
  type: Primary,
  phoneNumber: '1112223333',
  emailAddress: 'www.email.com',
  websiteUrl: 'https://www.wework.com'
};

const response: IContactInformation = {
  ...values,
  id: 'd34acb83-4164-4395-bc86-b01171429eaa',
  type: Primary,
  emailAddress: 'www.email.com',
  isDeleted: false,
  organizationId: organization.id
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ contactInformation: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('add contact information', () => {
  it('adds contact information successfully', async () => {
    axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/contactInformation`).reply(200, response);
    await store.dispatch(addContactInformation(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addContactInformationRequest());
    expect(actions[1]).toEqual(addContactInformationSuccess(response));
  });

  it('fails to add contact information', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/contactInformation`).networkError();
      await store.dispatch(addContactInformation(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addContactInformationRequest());
      expect(actions[1]).toEqual(addContactInformationFailure(error));
    }
  });
});
