import axios, { AxiosError } from 'axios';
import { AsyncResult } from 'react-select-async-paginate';
import { IServiceRegion } from '@pec/aion-ui-core/interfaces/serviceRegion';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteServiceRegionsRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_SERVICE_REGIONS_REQUEST'
  } as const);

const fetchAutocompleteServiceRegionsSuccess = (payload: IServiceRegion[], totalCount: number, currentPage: number) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_SERVICE_REGIONS_SUCCESS',
    payload,
    totalCount,
    currentPage
  } as const);

const fetchAutocompleteServiceRegionsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_SERVICE_REGIONS_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteServiceRegions = (
  inputValue?: string,
  page: number = 1,
  top: number = 10
): ThunkAction<Promise<AsyncResult<IServiceRegion, SelectAdditional>>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteServiceRegionsRequest());

      const { Contains } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip((page - 1) * top)
        .filter(({ filterBy }) => filterBy('description', Contains, inputValue))
        .orderBy('description')
        .toQueryParam();

      const { data } = await axios.get<{ value: IServiceRegion[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/serviceRegions',
        { params }
      );

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchAutocompleteServiceRegionsSuccess(payload, total, page));
      resolve({
        options: payload,
        hasMore: Math.ceil(total / top) > page,
        additional: { page: page + 1 }
      });
    } catch (error) {
      dispatch(fetchAutocompleteServiceRegionsFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchAutocompleteServiceRegionsRequest>
  | ReturnType<typeof fetchAutocompleteServiceRegionsSuccess>
  | ReturnType<typeof fetchAutocompleteServiceRegionsFailure>;
