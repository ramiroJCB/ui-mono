import axios, { AxiosError } from 'axios';
import { AsyncResult } from 'react-select-async-paginate';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OptionType } from '@pec/aion-ui-core/types/option';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteJobTypesRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_JOB_TYPES_REQUEST'
  } as const);

const fetchAutocompleteJobTypesSuccess = (payload: IJobType[], totalCount: number, currentPage: number) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_JOB_TYPES_SUCCESS',
    payload,
    totalCount,
    currentPage
  } as const);

const fetchAutocompleteJobTypesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_JOB_TYPES_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteJobTypes = (
  organizationId: string,
  inputValue?: string,
  page: number = 1,
  top: number = 10
): ThunkAction<Promise<AsyncResult<OptionType, SelectAdditional>>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteJobTypesRequest());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip((page - 1) * top)
        .filter(({ filterBy }) =>
          filterBy('name', Contains, inputValue)
            .filterBy('organizationId', Equals, organizationId)
            .filterBy('isDeleted', Equals, false)
        )
        .orderBy('name')
        .toQueryParam();

      const { data } = await axios.get<{ value: IJobType[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/jobTypes',
        { params }
      );

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchAutocompleteJobTypesSuccess(payload, total, page));
      resolve({
        options: payload,
        hasMore: Math.ceil(total / top) > page,
        additional: { page: page + 1 }
      });
    } catch (error) {
      dispatch(fetchAutocompleteJobTypesFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchAutocompleteJobTypesRequest>
  | ReturnType<typeof fetchAutocompleteJobTypesSuccess>
  | ReturnType<typeof fetchAutocompleteJobTypesFailure>;
