import { error, organizations, searchFilters, searchResults } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';
import { IUploadedLogo } from 'interfaces/uploadedLogo';

let prevState: State;
const organization = organizations[2];
const logo = new Blob(['foobar'], { type: 'image/jpeg' });
const metaData: IUploadedLogo = {
  id: 'd43d747e-274c-4517-a64e-ed30b833e790',
  organizationId: organization.id,
  isDeleted: false,
  fileName: 'test.jpg',
  mimeType: 'image/jpeg',
  storagePath: 'organization-images/f2d16e64-25de-4357-add9-b82d1d94ce40.jpg'
};

beforeEach(() => {
  prevState = initialState;
});

describe('search contractors reducer', () => {
  it('should update state correctly when dispatching FETCH_SEARCH_RESULT_LOGO_REQUEST', () => {
    prevState = { ...initialState, searchResults };

    const nextState = reducer(prevState, {
      type: 'FETCH_SEARCH_RESULT_LOGO_REQUEST',
      organizationId: organization.id
    });

    expect(prevState.searchResults[0]).toEqual(searchResults[0]);
    expect(nextState.searchResults[0]).toEqual({ ...searchResults[0], isFetching: true });
  });

  it('should update state correctly when dispatching FETCH_SEARCH_RESULT_LOGO_SUCCESS', () => {
    prevState = { ...initialState, searchResults };

    const nextState = reducer(prevState, {
      type: 'FETCH_SEARCH_RESULT_LOGO_SUCCESS',
      payload: logo,
      metaData,
      organizationId: organization.id
    });

    expect(prevState.searchResults[0]).toEqual(searchResults[0]);
    expect(nextState.searchResults[0]).toEqual({ ...searchResults[0], logo, isFetching: false, hasFetched: true });
  });

  it('should update state correctly when dispatching FETCH_SEARCH_RESULTS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_SEARCH_RESULTS_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching FETCH_SEARCH_RESULTS_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_SEARCH_RESULTS_SUCCESS',
      totalCount: searchResults.length,
      payload: searchResults,
      searchFilters,
      values: {
        keyword: 'Foobar',
        city: 'Nowhere',
        state: { value: 'LA', label: 'Louisiana' },
        distance: { value: 100, label: '100 miles' },
        filters: null
      }
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.totalCount).toEqual(searchResults.length);
    expect(nextState.searchResults).toEqual(searchResults);
    expect(nextState.searchFilters).toEqual(searchFilters);
    expect(nextState.values).toEqual({
      keyword: 'Foobar',
      city: 'Nowhere',
      state: { value: 'LA', label: 'Louisiana' },
      distance: { value: 100, label: '100 miles' },
      filters: null
    });
  });

  it('should update state correctly when dispatching FETCH_SEARCH_RESULTS_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_SEARCH_RESULTS_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
