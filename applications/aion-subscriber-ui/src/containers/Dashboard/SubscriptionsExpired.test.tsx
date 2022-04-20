import '@pec/aion-ui-i18next';
import * as React from 'react';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { SubscriptionsExpiredContainer } from './SubscriptionsExpired';
import { mount } from 'enzyme';

it('renders nothing if subscriptions have not been fetched', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ subscriptions: { isFetching: true } }}>
      <SubscriptionsExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(SubscriptionsExpiredContainer).isEmptyRender()).toEqual(true);
});

it('renders a message if subscriptions have expired', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        subscriptions: {
          subscriptions: [
            {
              id: '6c9f950d-453e-4302-91c6-9c475e5d97c0',
              typeDisplayName: 'PEC Connect',
              isExpired: true
            }
          ]
        }
      }}
    >
      <SubscriptionsExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.text()).toMatch('PEC Connect expired on');
});

it('renders a message if subscriptions are inactive', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        subscriptions: {
          subscriptions: [
            {
              id: '6c9f950d-453e-4302-91c6-9c475e5d97c0',
              typeDisplayName: 'Verifications Package',
              status: 'Inactive'
            }
          ]
        }
      }}
    >
      <SubscriptionsExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.text()).toMatch('Verifications Package expired');
});

it('renders nothing if subscriptions have not expired', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        subscriptions: {
          subscriptions: [
            {
              id: '6c9f950d-453e-4302-91c6-9c475e5d97c0',
              typeDisplayName: 'PEC Connect',
              isExpired: false
            }
          ]
        }
      }}
    >
      <SubscriptionsExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(SubscriptionsExpiredContainer).isEmptyRender()).toEqual(true);
});
