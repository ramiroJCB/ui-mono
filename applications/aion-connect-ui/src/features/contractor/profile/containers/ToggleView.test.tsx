import * as React from 'react';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { ToggleViewContainer } from './ToggleView';
import { Typography } from '@material-ui/core';

describe('toggle view container', () => {
  it('renders the toggle view container with switch turned off', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>> state={{ profile: { viewAsClient: false } }}>
        <ToggleViewContainer />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find(Typography).text()).toEqual('View Profile as Client');
    expect(wrapper.find('input').props().checked).toBeFalsy();
  });

  it('renders the toggle view container with switch turned on', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>> state={{ profile: { viewAsClient: true } }}>
        <ToggleViewContainer />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find(Typography).text()).toEqual('Viewing Profile as Client');
    expect(wrapper.find('input').props().checked).toBeTruthy();
  });
});
