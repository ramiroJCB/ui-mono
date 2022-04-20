import '@pec/aion-ui-i18next';
import * as React from 'react';
import OrganizationsResults from './OrganizationsResults';
import Typography from '@material-ui/core/Typography';
import createMemoryHistory from 'history/createMemoryHistory';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { featureFlags } from '../../fixtures';
import { mount } from 'enzyme';

describe('organizations results', () => {
  it('renders a loading spinner when searching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter state={{ organizations: { isFetching: true }, company: {}, featureFlags: { featureFlags } }}>
        <OrganizationsResults
          history={createMemoryHistory()}
          match={{
            params: {
              searchTerm: 'Acme & Co'
            }
          }}
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.containsMatchingElement(<Loading />)).toEqual(true);
  });

  it('renders an error icon', () => {
    const wrapper = mount(
      <FakeStoreAndRouter
        state={{ organizations: { isFetching: false, error: true }, company: {}, featureFlags: { featureFlags } }}
      >
        <OrganizationsResults
          history={createMemoryHistory()}
          match={{
            params: {
              searchTerm: 'Acme & Co'
            }
          }}
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.containsMatchingElement(<Error />)).toEqual(true);
  });

  it('shows a message if no results are found', () => {
    const wrapper = mount(
      <FakeStoreAndRouter
        state={{
          organizations: { isFetching: false, organizations: [] },
          company: {},
          featureFlags: {
            featureFlags
          }
        }}
      >
        <OrganizationsResults
          history={createMemoryHistory()}
          match={{
            params: {
              searchTerm: 'Acme & Co'
            }
          }}
        />
      </FakeStoreAndRouter>
    );
    expect(wrapper.containsMatchingElement(<Typography>No Organizations match your search</Typography>)).toEqual(true);
  });
});
