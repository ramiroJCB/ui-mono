import axios, { AxiosError } from 'axios';
import { AsyncResult } from 'react-select-async-paginate';
import { IContractor } from 'interfaces/contractor';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OptionType } from '@pec/aion-ui-core/types/option';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteContractorsRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_CONTRACTORS_REQUEST'
  } as const);

const fetchAutocompleteContractorsSuccess = (payload: IContractor[], totalCount: number, currentPage: number) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_CONTRACTORS_SUCCESS',
    payload,
    totalCount,
    currentPage
  } as const);

const fetchAutocompleteContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_CONTRACTORS_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteContractors = (
  organizationId: string,
  inputValue?: string,
  page: number = 1,
  top: number = 10
): ThunkAction<Promise<AsyncResult<OptionType, SelectAdditional>>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteContractorsRequest());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip((page - 1) * top)
        .filter(({ filterBy }) =>
          filterBy('name', Contains, inputValue)
            .filterBy('clientId', Equals, organizationId)
            .filterBy('isDeleted', Equals, false)
        )
        .orderBy('name')
        .toQueryParam();

      const { data } = await axios.get<{ value: IContractor[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/contractors',
        { params }
      );

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchAutocompleteContractorsSuccess(payload, total, page));
      resolve({
        options: payload,
        hasMore: Math.ceil(total / top) > page,
        additional: { page: page + 1 }
      });
    } catch (error) {
      dispatch(fetchAutocompleteContractorsFailure(error));
      reject();
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchAutocompleteContractorsRequest>
  | ReturnType<typeof fetchAutocompleteContractorsSuccess>
  | ReturnType<typeof fetchAutocompleteContractorsFailure>;
