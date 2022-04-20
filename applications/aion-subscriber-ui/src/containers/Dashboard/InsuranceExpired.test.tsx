import '@pec/aion-ui-i18next';
import * as React from 'react';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { InsuranceExpiredContainer } from './InsuranceExpired';
import { insurances } from '../../../fixtures/insurances';
import { mount } from 'enzyme';

it('renders nothing if insurance has not been fetched', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ insurances: { isFetching: true } }}>
      <InsuranceExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(InsuranceExpiredContainer).isEmptyRender()).toEqual(true);
});

it('renders a message if insurance has expired', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        insurances: {
          insurances
        }
      }}
    >
      <InsuranceExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.text()).toMatch('Parsley Energy expired');
});

it('renders nothing if insurance has not expired', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        insurances: {
          insurances: insurances.slice(1)
        }
      }}
    >
      <InsuranceExpiredContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(InsuranceExpiredContainer).isEmptyRender()).toEqual(true);
});
