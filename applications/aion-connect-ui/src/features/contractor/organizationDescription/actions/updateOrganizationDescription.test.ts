import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  updateOrganization,
  updateOrganizationFailure,
  updateOrganizationRequest,
  updateOrganizationSuccess
} from './updateOrganizationDescription';
import { initialState } from '@pec/aion-ui-core/reducers/organization';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[1];
const value = { ...organization, description: 'All the best things' };
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ organization: { ...initialState, organization } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('update organizations description', () => {
  it('dipatches a success action with the updated description', async () => {
    axiosMock.onPatch(`/api/v2/organizations/${organization.id}`).reply(200, value);
    await store.dispatch(updateOrganization(organization.id, value));

    const actions = store.getActions();

    expect(actions[0]).toEqual(updateOrganizationRequest());
    expect(actions[1]).toEqual(updateOrganizationSuccess(value));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPut(`/api/v2.organizations/${organization.id}`).networkError();
      await store.dispatch(updateOrganization(organization.id, value));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(updateOrganizationRequest());
      expect(actions[1]).toEqual(updateOrganizationFailure(error));
    }
  });
});
