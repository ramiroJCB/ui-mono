import '@pec/aion-ui-i18next';
import * as React from 'react';
import * as fixtures from '@pec/aion-ui-core/fixtures';
import CheckPermission from './CheckPermission';
import { ActivityAction } from '@pec/aion-ui-core/interfaces/activities';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { featureFlags } from '../../fixtures';
import { mount, render } from 'enzyme';

const { userInfo } = fixtures;

describe('check permission container', () => {
  it('renders a loading spinner', () => {
    const wrapper = mount(
      <FakeStoreAndRouter state={{ userInfo: { isFetching: true }, featureFlags: { featureFlags } }}>
        <CheckPermission />
      </FakeStoreAndRouter>
    );

    expect(wrapper.containsMatchingElement(<Loading />)).toEqual(true);
  });

  it('displays message if user already is a registered student', () => {
    window.location.replace = jest.fn();

    const wrapper = mount(
      <FakeStoreAndRouter
        state={{
          userInfo: {
            isFetching: false,
            userInfo: {
              ...userInfo,
              activities: [
                {
                  id: userInfo.userId,
                  type: UserInfoActivitiesType.User,
                  activities: {
                    Students: [ActivityAction.Read]
                  }
                }
              ]
            }
          },
          featureFlags: {
            featureFlags
          }
        }}
      >
        <CheckPermission />
      </FakeStoreAndRouter>
    );
    expect(wrapper.text()).toMatch('You are currently logged in as a registered student.');
  });

  it('allows the user to register', () => {
    window.location.replace = jest.fn();

    const wrapper = render(
      <FakeStoreAndRouter
        state={{
          organization: {},
          userOrganizations: {},
          authentication: {},
          userInfo: {
            isFetching: false,
            userInfo
          },
          featureFlags
        }}
      >
        <CheckPermission>
          <p>Welcome to Registration-UI!</p>
        </CheckPermission>
      </FakeStoreAndRouter>
    );

    expect(window.location.replace).not.toHaveBeenCalled();
    expect(wrapper.text()).toMatch('Welcome to Registration-UI!');
  });
});
