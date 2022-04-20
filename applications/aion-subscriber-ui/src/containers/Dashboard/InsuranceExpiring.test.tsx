import '@pec/aion-ui-i18next';
import * as React from 'react';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { InsuranceExpiringContainer } from './InsuranceExpiring';
import { insurances } from '../../../fixtures/insurances';
import { mount } from 'enzyme';

it('renders nothing if insurance has not been fetched', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ insurances: { isFetching: true } }}>
      <InsuranceExpiringContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(InsuranceExpiringContainer).isEmptyRender()).toEqual(true);
});

it('renders a message if insurance is expiring within 30 days', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        insurances: {
          insurances
        }
      }}
    >
      <InsuranceExpiringContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.text()).toMatch('Sage Energy expires');
});

it('renders nothing if insurance is not expiring within 30 days', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        insurances: {
          insurances: [insurances[0], insurances[2], insurances[3]]
        }
      }}
    >
      <InsuranceExpiringContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(InsuranceExpiringContainer).isEmptyRender()).toEqual(true);
});
