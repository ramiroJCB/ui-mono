import * as React from 'react';
import { render } from 'enzyme';
import { App } from './App';

it('renders without crashing', () => {
  const wrapper = render(<App />);
  expect(wrapper).toHaveLength(1);
});
