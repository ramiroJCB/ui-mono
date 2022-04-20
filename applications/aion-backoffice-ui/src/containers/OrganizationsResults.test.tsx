import * as React from 'react';
import createMemoryHistory from 'history/createMemoryHistory';
import OrganizationsResults from './OrganizationsResults';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';
import '@pec/aion-ui-i18next';

describe('organizations results', () => {
  it('renders a loading spinner when searching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter state={{ organizations: { isFetching: true } }}>
        <OrganizationsResults
          history={createMemoryHistory()}
          match={{
            params: {
              searchTerm: 'Acme & Co',
              pageNumber: '1'
            }
          }}
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find('[role="progressbar"]')).toHaveLength(1);
  });

  it('renders an error icon', () => {
    const wrapper = mount(
      <FakeStoreAndRouter state={{ organizations: { isFetching: false, error: true } }}>
        <OrganizationsResults
          history={createMemoryHistory()}
          match={{
            params: {
              searchTerm: 'Acme & Co',
              pageNumber: '1'
            }
          }}
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find(Error)).toHaveLength(1);
  });

  it('shows a message if no results are found', () => {
    const wrapper = mount(
      <FakeStoreAndRouter state={{ organizations: { isFetching: false, organizations: [] } }}>
        <OrganizationsResults
          history={createMemoryHistory()}
          match={{
            params: {
              searchTerm: 'Acme & Co',
              pageNumber: '1'
            }
          }}
        />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find('p')
        .first()
        .text()
    ).toEqual('No Organizations match your search');
  });
});
