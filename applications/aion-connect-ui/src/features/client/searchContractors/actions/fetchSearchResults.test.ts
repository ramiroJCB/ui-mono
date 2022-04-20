import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  fetchSearchResults,
  fetchSearchResultsFailure,
  fetchSearchResultsRequest,
  fetchSearchResultsSuccess
} from './fetchSearchResults';
import { initialState } from '../reducer';
import { ISearchContractorsForm } from 'interfaces/searchContractorsForm';
import { RootState } from 'combineReducers';

const { searchResults, searchFilters } = fixtures;
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ searchResults: initialState });
const values: ISearchContractorsForm = {
  keyword: 'Foobar',
  city: 'Nowhere',
  state: { value: 'LA', label: 'Louisiana' },
  distance: { value: 100, label: '100 miles' },
  filters: null
};

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('fetch search results', () => {
  it('dipatches a success action with search results', async () => {
    axiosMock
      .onGet('/api/v3.01/organizations/contractorSearch')
      .reply(200, { '@odata.count': searchResults.length, value: searchResults });

    axiosMock.onGet('/api/v3.01/organizations/contractorSearchFilters').reply(200, searchFilters);
    await store.dispatch(fetchSearchResults(values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(fetchSearchResultsRequest());
    expect(actions[1]).toEqual(fetchSearchResultsSuccess(searchResults, searchFilters, searchResults.length, values));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onGet('/api/v3.01/organizations/contractorSearchFilters').networkError();
      axiosMock.onGet('/api/v3.01/organizations/contractorSearch').networkError();
      await store.dispatch(fetchSearchResults(values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(fetchSearchResultsRequest());
      expect(actions[1]).toEqual(fetchSearchResultsFailure(error));
    }
  });
});
