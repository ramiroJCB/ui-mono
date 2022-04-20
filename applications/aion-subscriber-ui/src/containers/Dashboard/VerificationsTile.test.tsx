import '@pec/aion-ui-i18next';
import * as React from 'react';
import { CircularProgress } from '@pec/aion-ui-components/components/CircularProgress';
import { ErrorIcon } from '@pec/aion-ui-components/components/ErrorIcon';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { VerificationsTileContainer } from './VerificationsTile';
import { mount } from 'enzyme';
import { subscriptions } from '@pec/aion-ui-core/fixtures/subscriptions';
import { verifications } from '../../../fixtures/verifications';

it('renders a loading spinner right away', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ verifications: { isFetching: true }, subscriptions: { subscriptions: [] } }}>
      <VerificationsTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(CircularProgress)).toHaveLength(1);
});

it('renders an error message if there was an error fetching', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ verifications: { error: true }, subscriptions: { error: false, isFetching: true } }}>
      <VerificationsTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(ErrorIcon)).toHaveLength(1);
});

it('renders a list of verifications', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        verifications: {
          verifications
        },
        subscriptions: { subscriptions: subscriptions.value }
      }}
    >
      <VerificationsTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find('li')).toHaveLength(verifications.length + subscriptions.value.length);
});

it('renders a message if no verifications are available', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{ verifications: { verifications: [] }, subscriptions: { subscriptions: subscriptions.value } }}
    >
      <VerificationsTileContainer />
    </FakeStoreAndRouter>
  );

  expect(
    wrapper
      .find('span')
      .at(2)
      .text()
  ).toBe('No Verifications are Available');
});
