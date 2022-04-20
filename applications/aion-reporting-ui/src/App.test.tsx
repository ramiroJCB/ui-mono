import * as React from 'react';
import App from './App';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  const wrapper = mount(<App />);
  expect(wrapper).not.toHaveLength(0);
});
