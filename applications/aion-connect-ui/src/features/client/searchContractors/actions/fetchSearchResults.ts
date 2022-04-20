import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ISearchContractorsForm } from 'interfaces/searchContractorsForm';
import { ISearchFilters } from 'interfaces/searchFilters';
import { ISearchResult, ISearchResultWithLogo } from 'interfaces/searchResult';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchSearchResultsRequest = () =>
  ({
    type: 'FETCH_SEARCH_RESULTS_REQUEST'
  } as const);

export const fetchSearchResultsSuccess = (
  payload: ISearchResultWithLogo[],
  searchFilters: ISearchFilters | null,
  totalCount: number,
  values: ISearchContractorsForm
) =>
  ({
    type: 'FETCH_SEARCH_RESULTS_SUCCESS',
    payload,
    searchFilters,
    totalCount,
    values
  } as const);

export const fetchSearchResultsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SEARCH_RESULTS_FAILURE',
    error
  } as const;
};

const handleFetchRequests = (
  values: ISearchContractorsForm,
  latitude: number,
  longitude: number
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      const employeeCountValue = values.filters?.employeeCount?.value;
      const { keyword, distance } = values;
      const { Equals, LessThanOrEqualTo, GreaterThanOrEqualTo } = OdataComparator;
      const params = new QueryBuilder()
        .top(100)
        .filter(f =>
          f
            .filterBy('naicsCode', Equals, values.filters?.naicsCode?.value)
            .filterBy('employeeCount', GreaterThanOrEqualTo, employeeCountValue === '500' ? employeeCountValue : 0)
            .filterBy(
              'employeeCount',
              LessThanOrEqualTo,
              employeeCountValue && ['9', '49', '99', '499'].includes(employeeCountValue)
                ? employeeCountValue
                : undefined
            )
        )
        .orderBy('profilePercentComplete desc, distance')
        .toQueryParam();

      let $filter = params.$filter;

      if (values.filters?.predictiveRanking?.value) {
        $filter =
          values.filters.predictiveRanking.value === 'No Ranking'
            ? `${params.$filter} and predictiveRanking eq null`
            : `${params.$filter} and predictiveRanking eq '${values.filters.predictiveRanking.value}'`;
      }

      const searchFiltersRequest = axios.get<ISearchFilters>('/api/v3.01/organizations/contractorSearchFilters', {
        params: { keyword, latitude, longitude, radius: distance?.value }
      });

      const searchResultsRequest = axios.get<{ value: ISearchResult[]; '@odata.count': number }>(
        '/api/v3.01/organizations/contractorSearch',
        {
          params: {
            ...params,
            $filter,
            keyword,
            latitude,
            longitude,
            radius: distance?.value,
            businessUnit: values.filters?.businessUnit?.value,
            tag: values.filters?.tag?.value,
            connectionStatus: values.filters?.connectionStatus?.value
          }
        }
      );

      const [searchFiltersResponse, searchResultsResponse] = await Promise.all([
        searchFiltersRequest,
        searchResultsRequest
      ]);

      const totalCount =
        searchResultsResponse.data['@odata.count'] !== undefined ? searchResultsResponse.data['@odata.count'] : 0;

      dispatch(
        fetchSearchResultsSuccess(searchResultsResponse.data.value, searchFiltersResponse.data, totalCount, values)
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });

export const fetchSearchResults = (
  values: ISearchContractorsForm
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchSearchResultsRequest());

      if (values.state && values.state.value && values.distance) {
        const { city, state } = values;
        const geocoder = new window.google.maps.Geocoder();
        const { OK, ZERO_RESULTS } = window.google.maps.GeocoderStatus;

        geocoder.geocode({ address: `${city}, ${state.value}` }, async (results, status) => {
          try {
            if (status === OK) {
              const {
                geometry: { location }
              } = results[0];

              const latitude = location.lat();
              const longitude = location.lng();

              await dispatch(handleFetchRequests(values, latitude, longitude));

              resolve();
            } else if (status === ZERO_RESULTS) {
              const [latitude, longitude] = [city, state].map(parseFloat);

              await dispatch(handleFetchRequests(values, latitude, longitude));

              resolve();
            } else {
              dispatch(fetchSearchResultsSuccess([], null, 0, values));
            }
          } catch (error) {
            dispatch(fetchSearchResultsFailure(error));
            dispatch(enqueueRequestErrorSnackbar());
            reject(error);
          }
        });
      }
    } catch (error) {
      dispatch(fetchSearchResultsFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchSearchResultsRequest>
  | ReturnType<typeof fetchSearchResultsSuccess>
  | ReturnType<typeof fetchSearchResultsFailure>;
