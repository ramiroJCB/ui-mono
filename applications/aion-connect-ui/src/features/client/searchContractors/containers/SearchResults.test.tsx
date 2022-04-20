import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as searchResultsInitialState } from '../reducer';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { SearchResultsContainer } from './SearchResults';

const { error } = fixtures;
const state = {
  searchResults: searchResultsInitialState
};

describe('search results container', () => {
  it('renders a loading spinner right away', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, searchResults: { ...searchResultsInitialState, isFetching: true } }}
      >
        <SearchResultsContainer />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Loading />)).toBe(true);
  });

  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, searchResults: { ...searchResultsInitialState, error } }}
      >
        <SearchResultsContainer />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Error message="There was an error processing your request." />)).toBe(true);
  });
});
