import * as React from 'react';
import App from './App';
import { render } from 'enzyme';

it('renders without crashing', () => {
  const wrapper = render(<App />);
  expect(wrapper).not.toHaveLength(0);
});
