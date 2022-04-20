import axios, { AxiosError } from 'axios';
import { IEmployee } from 'interfaces/employee';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteEmployeesForValidationRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_EMPLOYEES_FOR_VALIDATION_REQUEST'
  } as const);

const fetchAutocompleteEmployeesForValidationSuccess = (payload: IWorkGroupJobTypeEmployee[], totalCount: number) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_EMPLOYEES_FOR_VALIDATION_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchAutocompleteEmployeesForValidationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_EMPLOYEES_FOR_VALIDATION_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteEmployeesForValidation = (
  values: IEmployee[],
  workGroupJobTypeId: string
): ThunkAction<Promise<IWorkGroupJobTypeEmployee[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteEmployeesForValidationRequest());

      const { Equals, In } = OdataComparator;
      const params = new QueryBuilder()
        .filter(({ filterBy }) =>
          filterBy('isDeleted', Equals, false)
            .filterBy('workGroupJobTypeId', Equals, workGroupJobTypeId)
            .filterBy(
              'employeeName',
              In,
              values.map(({ name }) => name)
            )
        )
        .toQueryParam();

      const { data } = await axios.get<{ value: IWorkGroupJobTypeEmployee[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypeEmployees',
        { params }
      );

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchAutocompleteEmployeesForValidationSuccess(payload, total));
      resolve(payload);
    } catch (error) {
      dispatch(fetchAutocompleteEmployeesForValidationFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchAutocompleteEmployeesForValidationRequest>
  | ReturnType<typeof fetchAutocompleteEmployeesForValidationSuccess>
  | ReturnType<typeof fetchAutocompleteEmployeesForValidationFailure>;
