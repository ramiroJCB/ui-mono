import * as React from 'react';
import { DashboardContainer } from './';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        insurances: { isFetching: true },
        questionnaireSections: { isFetching: true },
        predictiveRanking: { isFetching: true },
        rankings: { isFetching: true },
        releases: { isFetching: true },
        organizations: { isFetching: true },
        organization: { isFetching: true },
        organizationLink: { isFetching: true },
        subscriptions: { isFetching: true },
        verifications: { isFetching: true },
        options: {},
        userInfo: { isFetching: true }
      }}
    >
      <DashboardContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(DashboardContainer).length).toBeGreaterThan(0);
});
