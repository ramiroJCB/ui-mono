import '@pec/aion-ui-i18next';
import * as React from 'react';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { VerificationsExpiredContainer } from './VerificationsExpired';
import { mount } from 'enzyme';
import { verifications } from '../../../fixtures/verifications';

it('renders nothing if verifications have not been fetched', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ verifications: { isFetching: true } }}>
      <VerificationsExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(VerificationsExpiredContainer).isEmptyRender()).toEqual(true);
});

it('renders a message if verifications have expired', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        verifications: {
          verifications
        }
      }}
    >
      <VerificationsExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.text()).toMatch('OSHA Verification expired');
});

it('renders nothing if verifications have not expired', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        verifications: {
          verifications: verifications.slice(1)
        }
      }}
    >
      <VerificationsExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(VerificationsExpiredContainer).isEmptyRender()).toEqual(true);
});
