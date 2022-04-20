import * as React from 'react';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';
import { ReleasesContainer } from './Releases';

it('renders nothing if releases have not been fetched', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ releases: { isFetching: true } }}>
      <ReleasesContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(ReleasesContainer).isEmptyRender()).toEqual(true);
});

it('renders a message if any releases are pending', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        releases: {
          isFetching: true,
          releases: [{ status: 'Approved' }, { status: 'Pending' }]
        }
      }}
    >
      <ReleasesContainer />
    </FakeStoreAndRouter>
  );
  expect(
    wrapper
      .find(ReleasesContainer)
      .at(0)
      .html()
  ).not.toBeNull();
});

it('renders nothing if no releases are pending', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        releases: {
          isFetching: true,
          releases: [{ status: 'Approved' }, { status: 'Approved' }]
        }
      }}
    >
      <ReleasesContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(ReleasesContainer).isEmptyRender()).toEqual(true);
});
