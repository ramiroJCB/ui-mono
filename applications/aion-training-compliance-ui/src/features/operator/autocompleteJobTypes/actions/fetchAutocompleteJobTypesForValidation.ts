import axios, { AxiosError } from 'axios';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteJobTypesForValidationRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_JOB_TYPES_FOR_VALIDATION_REQUEST'
  } as const);

const fetchAutocompleteJobTypesForValidationSuccess = (payload: IWorkGroupJobType[], totalCount: number) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_JOB_TYPES_FOR_VALIDATION_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchAutocompleteJobTypesForValidationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_JOB_TYPES_FOR_VALIDATION_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteJobTypesForValidation = (
  values: IJobType[],
  workGroupId: string
): ThunkAction<Promise<IWorkGroupJobType[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteJobTypesForValidationRequest());

      const { In, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .filter(({ filterBy }) =>
          filterBy('isDeleted', Equals, false)
            .filterBy('workGroupId', Equals, workGroupId)
            .filterBy(
              'jobTypeId',
              In,
              values.map(({ id }) => id)
            )
        )
        .toQueryParam();
      const { data } = await axios.get<{ value: IWorkGroupJobType[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypes',
        { params }
      );

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchAutocompleteJobTypesForValidationSuccess(payload, total));
      resolve(payload);
    } catch (error) {
      dispatch(fetchAutocompleteJobTypesForValidationFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchAutocompleteJobTypesForValidationRequest>
  | ReturnType<typeof fetchAutocompleteJobTypesForValidationSuccess>
  | ReturnType<typeof fetchAutocompleteJobTypesForValidationFailure>;
