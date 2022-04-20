import * as fixtures from '@pec/aion-ui-core/fixtures';
import * as React from 'react';
import ManageOrganization from './ManageOrganization';
import { Error as ErrorComponent } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';

const { organizations, organizationFeatures } = fixtures;

describe('manage organization page', () => {
  it('renders a loading spinner', () => {
    const wrapper = mount(
      <FakeStoreAndRouter state={{ organization: { isFetching: true }, organizationFeatures: {} }}>
        <ManageOrganization
          match={{
            params: {
              organizationId: organizations[0].id
            }
          }}
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find('[role="progressbar"]')).toHaveLength(1);
  });

  it('renders an error icon if fetching an organization fails', () => {
    const wrapper = mount(
      <FakeStoreAndRouter
        state={{
          organization: { fetchError: new Error('Error fetching organization record') },
          organizationFeatures: {}
        }}
      >
        <ManageOrganization
          match={{
            params: {
              organizationId: organizations[0].id
            }
          }}
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find(ErrorComponent)).toHaveLength(1);
  });

  it('renders an icon messages component with the message if updating an organization fails', () => {
    const wrapper = mount(
      <FakeStoreAndRouter
        state={{
          organization: {
            updateError: new Error('Error updating organization record'),
            organization: organizations[0]
          },
          organizationFeatures: { organizationFeatures }
        }}
      >
        <ManageOrganization
          match={{
            params: {
              organizationId: organizations[0].id
            }
          }}
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.text()).toMatch('Error updating organization record');
  });

  it('renders an organization and the features checkboxes', () => {
    const wrapper = mount(
      <FakeStoreAndRouter
        state={{
          organization: {
            organization: organizations[0]
          },
          organizationFeatures: { organizationFeatures }
        }}
      >
        <ManageOrganization
          match={{
            params: {
              organizationId: organizations[0].id
            }
          }}
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find('h5').text()).toEqual(organizations[0].name);
    expect(wrapper.find('input').findWhere(a => a.prop('name') === 'features[Qualifications]')).toHaveLength(1);
  });
});
