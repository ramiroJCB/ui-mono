import axios, { AxiosError } from 'axios';
import { AsyncResult } from 'react-select-async-paginate';
import { IEmployee } from 'interfaces/employee';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OptionType } from '@pec/aion-ui-core/types/option';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteEmployeesRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_EMPLOYEES_REQUEST'
  } as const);

const fetchAutocompleteEmployeesSuccess = (payload: IEmployee[], totalCount: number, currentPage: number) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_EMPLOYEES_SUCCESS',
    payload,
    totalCount,
    currentPage
  } as const);

const fetchAutocompleteEmployeesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_EMPLOYEES_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteEmployees = (
  organizationId: string,
  workGroupJobTypeId: string,
  inputValue?: string,
  page: number = 1,
  top: number = 10
): ThunkAction<Promise<AsyncResult<OptionType, SelectAdditional>>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteEmployeesRequest());

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

      const { data } = await axios.get<{ value: IEmployee[]; '@odata.count': number }>(
        `/api/trainingCompliance/v3.01/workGroupJobTypes(${workGroupJobTypeId})/NotAssignedEmployees`,
        { params }
      );

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchAutocompleteEmployeesSuccess(payload, total, page));
      resolve({
        options: payload,
        hasMore: Math.ceil(total / top) > page,
        additional: { page: page + 1 }
      });
    } catch (error) {
      dispatch(fetchAutocompleteEmployeesFailure(error));
      reject();
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchAutocompleteEmployeesRequest>
  | ReturnType<typeof fetchAutocompleteEmployeesSuccess>
  | ReturnType<typeof fetchAutocompleteEmployeesFailure>;
