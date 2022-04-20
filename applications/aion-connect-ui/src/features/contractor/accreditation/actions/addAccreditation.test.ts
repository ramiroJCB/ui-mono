import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  addAccreditation,
  addAccreditationFailure,
  addAccreditationRequest,
  addAccreditationSuccess
} from './addAccreditation';
import { IAccreditation } from 'interfaces/accreditation';
import { IAccreditationForm } from 'interfaces/accreditationForm';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const values: IAccreditationForm = {
  name: 'Petroleum Engineering',
  issueDateUtc: '2018-09-15T03:00:00Z',
  accreditationId: 'SPE-864-hgtv'
};

const response: IAccreditation = {
  ...values,
  id: 'd34acb83-4164-4395-bc86-b01171429eaa',
  organizationId: organization.id,
  isDeleted: false
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ accreditation: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('add accreditation', () => {
  it('dipatches a success action with the newly created accreditation', async () => {
    axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/accreditations`).reply(200, response);
    await store.dispatch(addAccreditation(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addAccreditationRequest());
    expect(actions[1]).toEqual(addAccreditationSuccess(response));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/accreditation`).networkError();
      await store.dispatch(addAccreditation(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addAccreditationRequest());
      expect(actions[1]).toEqual(addAccreditationFailure(error));
    }
  });
});
