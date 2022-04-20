import '@pec/aion-ui-i18next';
import * as React from 'react';
import { CircularProgress } from '@pec/aion-ui-components/components/CircularProgress';
import { ClientScoresTileContainer } from './ClientScoresTile';
import { ErrorIcon } from '@pec/aion-ui-components/components/ErrorIcon';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';

it('renders a loading spinner right away', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ options: {}, rankings: { isFetching: true } }}>
      <ClientScoresTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(CircularProgress)).toHaveLength(1);
});

it('renders an error message if there was an error fetching', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ options: {}, rankings: { error: true } }}>
      <ClientScoresTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(ErrorIcon)).toHaveLength(1);
});

it('renders a message if no client scores are available', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ options: {}, rankings: { rankings: [] } }}>
      <ClientScoresTileContainer />
    </FakeStoreAndRouter>
  );
  expect(
    wrapper
      .find('h6')
      .last()
      .text()
  ).toBe('No Client Scores are Available');
});
