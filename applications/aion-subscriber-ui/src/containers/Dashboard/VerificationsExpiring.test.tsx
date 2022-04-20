import '@pec/aion-ui-i18next';
import * as React from 'react';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { VerificationsExpiringContainer } from './VerificationsExpiring';
import { mount } from 'enzyme';
import { verifications } from '../../../fixtures/verifications';

it('renders nothing if verifications have not been fetched', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ verifications: { isFetching: true } }}>
      <VerificationsExpiringContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(VerificationsExpiringContainer).isEmptyRender()).toEqual(true);
});

it('renders a message if verifications are expiring within their specified period', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        verifications: {
          verifications
        }
      }}
    >
      <VerificationsExpiringContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.text()).toMatch('EMR Verification expires');
});

it('renders nothing if no verifications are expiring within 30 days', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        verifications: { verifications: [verifications[2]] }
      }}
    >
      <VerificationsExpiringContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(VerificationsExpiringContainer).isEmptyRender()).toEqual(true);
});
