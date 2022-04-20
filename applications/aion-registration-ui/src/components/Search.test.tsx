import * as React from 'react';
import Button from '@material-ui/core/Button';
import createMemoryHistory from 'history/createMemoryHistory';
import Search, { Props, State } from './Search';
import TextField from '@material-ui/core/TextField';
import { shallow } from 'enzyme';
import '@pec/aion-ui-i18next';

describe('search organizations input', () => {
  it('renders the component', () => {
    const wrapper = shallow<Props, State>(<Search history={createMemoryHistory()} uri="" label="" placeholder="" />);

    expect(wrapper.html()).not.toBeNull();
  });

  it('decodes an encoded searchTerm prop', () => {
    const wrapper = shallow<Props, State>(
      <Search searchTerm="Acme %26 Co" history={createMemoryHistory()} uri="" label="" placeholder="" />
    )
      .dive()
      .dive();

    const instance = wrapper.instance() as React.Component<Props, State>;

    expect(instance.state.searchTerm).toEqual('Acme & Co');
  });

  it('searches and encodes text based on what input was given', () => {
    const wrapper = shallow<Props, State>(
      <Search history={createMemoryHistory()} uri="/companies/search/%s" label="" placeholder="" />
    )
      .dive()
      .dive();

    const instance = wrapper.instance() as React.Component<Props, State>;

    wrapper.find(TextField).simulate('change', { target: { value: 'Acme & Co' } });
    wrapper.find(Button).simulate('click');

    expect(instance.state.searchTerm).toEqual('Acme & Co');
    expect(instance.props.history.location.pathname).toEqual('/companies/search/Acme %26 Co');
  });
});
