import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  addGlobalOrganizationFeature,
  addGlobalOrganizationFeatureRequest,
  addGlobalOrganizationFeatureSuccess,
  addGlobalOrganizationFeatureFailure
} from './addGlobalOrganizationFeature';
import { IOrganizationFeatureForm } from 'interfaces/organizationFeatureForm';
import { OrganizationType } from '../interfaces/organizationFeatureForm';
import { RootState } from 'combineReducers';

const { organizationFeatures } = fixtures;
const organizationFeature = organizationFeatures[7];

const { Contractor } = OrganizationType;

const orgFeatureForm: IOrganizationFeatureForm = {
  feature: organizationFeature,
  organizationType: Contractor
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<Partial<RootState>, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const initialState = {
  organizationFeatures: { isFetching: false, organizationFeatures: null, error: null }
};
const store = mockStore(initialState);

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('add global organization feature', () => {
  it('dispatched a success action with the newly created global feature', async () => {
    axiosMock.onPost(`api/v3.01/globalOrganizationFeatures`).reply(204);
    await store.dispatch(addGlobalOrganizationFeature(orgFeatureForm));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addGlobalOrganizationFeatureRequest());
    expect(actions[1]).toEqual(addGlobalOrganizationFeatureSuccess(organizationFeature));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`api/v3.01/globalOrganizationFeatures`, { feature: orgFeatureForm }).networkError();
      await store.dispatch(addGlobalOrganizationFeature(orgFeatureForm));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addGlobalOrganizationFeatureRequest());
      expect(actions[1]).toEqual(addGlobalOrganizationFeatureFailure(error));
    }
  });
});
