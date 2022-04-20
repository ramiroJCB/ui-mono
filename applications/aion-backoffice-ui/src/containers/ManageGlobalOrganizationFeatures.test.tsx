import * as fixtures from '../../fixtures';
import * as React from 'react';
import axios from 'axios';
import ManageGlobalOrganizationFeaturesContainer from './ManageGlobalOrganizationFeatures';
import MockAdapter from 'axios-mock-adapter';
import { AssignRemoveGlobalOrganizationFeature } from '../components/AssignRemoveGlobalOrganizationFeature';
import { Error as ErrorComponent } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { mount } from 'enzyme';

const { organizationFeatures } = fixtures;
const axiosMock = new MockAdapter(axios);

beforeEach(() => {
  axiosMock.onGet('/api/v2/organizationfeatures').reply(200, organizationFeatures);
  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('manage global organization features page', () => {
  it('renders a loading spinner right away', () => {
    const wrapper = mount(
      <FakeStoreAndRouter
        state={{
          organizationFeatures: { isFetching: true, organizationFeatures: [], error: null }
        }}
      >
        <ManageGlobalOrganizationFeaturesContainer />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Loading />)).toBe(true);
  });

  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter
        state={{
          organizationFeatures: { isFetching: false, organizationFeatures: [], error: true }
        }}
      >
        <ManageGlobalOrganizationFeaturesContainer />
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find(ErrorComponent)).toHaveLength(1);
  });

  it('renders the list of organization features and the assign and remove boxes for non legacy features', () => {
    const wrapper = mount(
      <FakeStoreAndRouter
        state={{
          organizationFeatures: { isFetching: false, organizationFeatures, error: false }
        }}
      >
        <ManageGlobalOrganizationFeaturesContainer />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find('p')).toHaveLength(5);
    expect(wrapper.find(AssignRemoveGlobalOrganizationFeature)).toHaveLength(10);
  });
});
