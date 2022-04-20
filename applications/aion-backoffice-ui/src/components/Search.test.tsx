import * as React from 'react';
import createMemoryHistory from 'history/createMemoryHistory';
import Search from './Search';
import { mount, shallow } from 'enzyme';

describe('search organizations input', () => {
  it('renders the component', () => {
    const wrapper = shallow(<Search history={createMemoryHistory()} uri="" header="" label="" placeholder="" />);

    expect(wrapper.html()).not.toBeNull();
  });

  it('decodes an encoded searchTerm prop', () => {
    const wrapper = shallow(
      <Search searchTerm="Acme %26 Co" history={createMemoryHistory()} uri="" header="" label="" placeholder="" />
    );

    expect(wrapper.instance().state.searchTerm).toEqual('Acme & Co');
  });

  it('searches and encodes text based on what input was given', () => {
    const wrapper = mount(
      <Search history={createMemoryHistory()} uri="/organizations/search/%s/page/1" header="" label="" placeholder="" />
    );

    const instance = wrapper.instance();

    wrapper.find('input').simulate('change', { target: { value: 'Acme & Co' } });
    wrapper.find('form').simulate('submit');

    expect(instance.state.searchTerm).toEqual('Acme & Co');
    expect(instance.props.history.location.pathname).toEqual('/organizations/search/Acme %26 Co/page/1');
  });
});
