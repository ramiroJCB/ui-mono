import * as React from 'react';
import createMemoryHistory from 'history/createMemoryHistory';
import IconButton from '@material-ui/core/IconButton';
import Results from './Results';
import { KeyboardArrowRight } from '@material-ui/core/internal';
import { mount } from 'enzyme';
import { Router } from 'react-router';

it('changes pages and encodes the search term', () => {
  const history = createMemoryHistory();
  const wrapper = mount(
    <Router history={history}>
      <Results
        pageUri="/organizations/search/%s/page/%p"
        searchTerm="Acme & Co"
        activePage="1"
        totalCount={15}
        history={history}
        results={[{ id: '281e440a-7b91-4ad1-9c74-d985fb04747b' }]}
        cols={{ id: 'id' }}
        uri=""
        emptyMessage=""
        pageSize={10}
      />
    </Router>
  );

  const instance = wrapper.instance();
  // One button is disabled, so this only fires on the enabled one.
  // A 'button + button' selector didn't work.
  wrapper.find('button').forEach(button => button.simulate('click'));

  expect(instance.props.history.location.pathname).toEqual('/organizations/search/Acme %26 Co/page/2');
});
