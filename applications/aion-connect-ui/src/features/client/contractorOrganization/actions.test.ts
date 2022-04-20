import * as fixtures from '../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  fetchContractorOrganization,
  fetchContractorOrganizationFailure,
  fetchContractorOrganizationRequest,
  fetchContractorOrganizationSuccess
} from './actions';
import { initialState } from './reducer';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ contractorOrganization: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('fetch contractor organization', () => {
  it('dipatches a success action with the organization', async () => {
    axiosMock
      .onGet(`/api/v3.00/organizations(${organization.id})?exposeLegacyId&includeClientFeatures=true`)
      .reply(200, organization);
    await store.dispatch(fetchContractorOrganization(organization.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(fetchContractorOrganizationRequest());
    expect(actions[1]).toEqual(fetchContractorOrganizationSuccess(organization));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock
        .onPut(`/api/v3.00/organizations(${organization.id})?exposeLegacyId&includeClientFeatures=true`)
        .networkError();
      await store.dispatch(fetchContractorOrganization(organization.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(fetchContractorOrganizationRequest());
      expect(actions[1]).toEqual(fetchContractorOrganizationFailure(error));
    }
  });
});
