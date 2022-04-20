import '@pec/aion-ui-i18next';
import * as React from 'react';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { SubscriptionsExpiringContainer } from './SubscriptionsExpiring';
import { mount } from 'enzyme';

it('renders nothing if subscriptions have not been fetched', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ subscriptions: { isFetching: true } }}>
      <SubscriptionsExpiringContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(SubscriptionsExpiringContainer).isEmptyRender()).toEqual(true);
});

it('renders a message if subscriptions are expiring', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        subscriptions: {
          subscriptions: [
            {
              id: '9b35ed66-457d-4519-89ee-d0189c67b465',
              typeDisplayName: 'PEC Connect',
              isExpiring: true
            }
          ]
        }
      }}
    >
      <SubscriptionsExpiringContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.text()).toMatch('PEC Connect expires');
});

it('renders nothing if no subscriptions are expiring', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        subscriptions: {
          subscriptions: [
            {
              id: '9b35ed66-457d-4519-89ee-d0189c67b465',
              typeDisplayName: 'PEC Connect',
              isExpiring: false
            }
          ]
        }
      }}
    >
      <SubscriptionsExpiringContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(SubscriptionsExpiringContainer).isEmptyRender()).toEqual(true);
});
