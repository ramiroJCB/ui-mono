import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import MockAdapter from 'axios-mock-adapter';
import { ConnectionStatus, ISearchContractorsForm } from 'interfaces/searchContractorsForm';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as searchResultsInitialState } from '../reducer';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';
import { SearchContractorsFormContainer } from './SearchContractorsForm';
import { SelectFieldComponent } from '@pec/aion-ui-form/components/Autocomplete/SelectField';

const { organizations, searchResults, searchFilters } = fixtures;
const organization = organizations[0];
const axiosMock = new MockAdapter(axios);
const axiosSpy = jest.spyOn(axios, 'get');
const state = {
  searchResults: searchResultsInitialState
};

const values: ISearchContractorsForm = {
  keyword: 'FooBar',
  city: 'Covington',
  state: { value: 'LA', label: 'Louisiana' },
  distance: { value: 100, label: '100 miles' },
  filters: {
    businessUnit: { value: 'Business Unit', label: 'Business Unit' },
    employeeCount: { value: '9', label: '<10' }
  }
};

beforeEach(() => {
  axiosMock
    .onGet('/api/v3.01/organizations/contractorSearch')
    .reply(200, { '@odata.count': searchResults.length, value: searchResults });

  axiosMock.onGet('/api/v3.01/organizations/contractorSearchFilters').reply(200, searchFilters);
});

afterEach(() => {
  axiosSpy.mockClear();
});

describe('search results form container', () => {
  it('fetches search results when submitting the form', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          searchResults: {
            ...searchResultsInitialState,
            searchResults,
            searchFilters
          }
        }}
      >
        <SearchContractorsFormContainer />
      </FakeStoreAndRouter>
    );

    wrapper.find('input[name="keyword"]').simulate('change', { target: { value: 'FooBar' } });
    wrapper.find('input[name="city"]').simulate('change', { target: { value: 'Covington' } });
    wrapper
      .find(SelectFieldComponent)
      .at(0)
      .props()
      .input.onChange({ value: 'LA', label: 'Louisiana' });
    wrapper
      .find(SelectFieldComponent)
      .at(1)
      .props()
      .input.onChange({ value: 100, label: '100 miles' });
    wrapper.find('form').simulate('submit');

    expect(axiosSpy).toHaveBeenNthCalledWith(1, '/api/v3.01/organizations/contractorSearchFilters', {
      params: {
        keyword: 'FooBar',
        latitude: 123,
        longitude: 456,
        radius: 100
      }
    });

    expect(axiosSpy).toHaveBeenNthCalledWith(2, '/api/v3.01/organizations/contractorSearch', {
      params: {
        $filter: 'employeeCount ge 0',
        $top: '100',
        $orderBy: 'profilePercentComplete desc, distance',
        keyword: 'FooBar',
        latitude: 123,
        longitude: 456,
        radius: 100
      }
    });
  });

  it('fetches search results when getting search results from query string when the required values do not exist in state', () => {
    mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          searchResults: {
            ...searchResultsInitialState,
            searchResults,
            searchFilters,
            values: {
              keyword: '',
              city: '',
              filters: null
            }
          }
        }}
        initialEntries={[
          `/organization/${organization.id}/connect/search-contractors?keyword=${values.keyword}&city=${values.city}&state=${values.state?.value}&distance=${values.distance?.value}`
        ]}
      >
        <Route
          path="/organization/:organizationId/connect/search-contractors"
          component={SearchContractorsFormContainer}
        />
      </FakeStoreAndRouter>
    );

    expect(axiosSpy).toHaveBeenNthCalledWith(1, '/api/v3.01/organizations/contractorSearchFilters', {
      params: {
        keyword: 'FooBar',
        latitude: 123,
        longitude: 456,
        radius: 100
      }
    });

    expect(axiosSpy).toHaveBeenNthCalledWith(2, '/api/v3.01/organizations/contractorSearch', {
      params: {
        $filter: 'employeeCount ge 0',
        $top: '100',
        $orderBy: 'profilePercentComplete desc, distance',
        keyword: 'FooBar',
        latitude: 123,
        longitude: 456,
        radius: 100
      }
    });
  });

  it('does not fetch search results when required values already exist in state', () => {
    mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          searchResults: {
            ...searchResultsInitialState,
            searchResults,
            searchFilters,
            values
          }
        }}
        initialEntries={[
          `/organization/${organization.id}/connect/search-contractors?keyword=${values.keyword}&city=${values.city}&state=${values.state?.value}&distance=${values.distance?.value}`
        ]}
      >
        <Route
          path="/organization/:organizationId/connect/search-contractors"
          component={SearchContractorsFormContainer}
        />
      </FakeStoreAndRouter>
    );

    expect(axiosSpy).toBeCalledTimes(0);
  });

  it('fetches search results based on changing form filters', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          searchResults: {
            ...searchResultsInitialState,
            searchResults,
            searchFilters,
            values
          }
        }}
        initialEntries={[
          `/organization/${organization.id}/connect/search-contractors?keyword=${values.keyword}&city=${values.city}&state=${values.state?.value}&distance=${values.distance?.value}`
        ]}
      >
        <Route
          path="/organization/:organizationId/connect/search-contractors"
          component={SearchContractorsFormContainer}
        />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(Button)
      .at(1)
      .simulate('click');

    wrapper
      .find(SelectFieldComponent)
      .at(2)
      .props()
      .input.onChange({ value: 'Business Unit', label: 'Business Unit' });

    wrapper
      .find(SelectFieldComponent)
      .at(4)
      .props()
      .input.onChange({ value: '500', label: '>500' });

    wrapper
      .find(Button)
      .at(3)
      .simulate('click');

    expect(axiosSpy).toHaveBeenNthCalledWith(1, '/api/v3.01/organizations/contractorSearchFilters', {
      params: {
        keyword: 'FooBar',
        latitude: 123,
        longitude: 456,
        radius: 100
      }
    });

    expect(axiosSpy).toHaveBeenNthCalledWith(2, '/api/v3.01/organizations/contractorSearch', {
      params: {
        $top: '100',
        $filter: 'employeeCount ge 500',
        $orderBy: 'profilePercentComplete desc, distance',
        keyword: 'FooBar',
        latitude: 123,
        longitude: 456,
        radius: 100,
        businessUnit: 'Business Unit'
      }
    });
  });

  it('fetches search results when getting search results and filters from query string when the required values do not exist in state', () => {
    mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{
          ...state,
          searchResults: {
            ...searchResultsInitialState,
            searchResults,
            searchFilters,
            values: {
              keyword: '',
              city: '',
              filters: null
            }
          }
        }}
        initialEntries={[
          `/organization/${organization.id}/connect/search-contractors?keyword=${values.keyword}&city=${values.city}&state=${values.state?.value}&distance=${values.distance?.value}&employeeCount=${values.filters?.employeeCount?.value}&businessUnit=${values.filters?.businessUnit?.value}`
        ]}
      >
        <Route
          path="/organization/:organizationId/connect/search-contractors"
          component={SearchContractorsFormContainer}
        />
      </FakeStoreAndRouter>
    );

    expect(axiosSpy).toHaveBeenNthCalledWith(1, '/api/v3.01/organizations/contractorSearchFilters', {
      params: {
        keyword: 'FooBar',
        latitude: 123,
        longitude: 456,
        radius: 100
      }
    });

    expect(axiosSpy).toHaveBeenNthCalledWith(2, '/api/v3.01/organizations/contractorSearch', {
      params: {
        $top: '100',
        $filter: 'employeeCount ge 0 and employeeCount le 9',
        $orderBy: 'profilePercentComplete desc, distance',
        keyword: 'FooBar',
        latitude: 123,
        longitude: 456,
        radius: 100,
        businessUnit: 'Business Unit',
        connectionStatus: ConnectionStatus.Connected
      }
    });
  });
});
