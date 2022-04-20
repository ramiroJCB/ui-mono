import axios, { AxiosError } from 'axios';
import { IContractor } from 'interfaces/contractor';
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteContractorsForValidationRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_CONTRACTORS_FOR_VALIDATION_REQUEST'
  } as const);

const fetchAutocompleteContractorsForValidationSuccess = (
  payload: IOperatorWorkGroupJobTypeContractor[],
  totalCount: number
) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_CONTRACTORS_FOR_VALIDATION_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchAutocompleteContractorsForValidationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_CONTRACTORS_FOR_VALIDATION_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteContractorsForValidation = (
  values: IContractor[],
  workGroupJobTypeId: string
): ThunkAction<Promise<IOperatorWorkGroupJobTypeContractor[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteContractorsForValidationRequest());

      const { In, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .filter(({ filterBy }) =>
          filterBy('isDeleted', Equals, false)
            .filterBy('workGroupJobTypeId', Equals, workGroupJobTypeId)
            .filterBy(
              'contractorId',
              In,
              values.map(({ id }) => id)
            )
        )
        .toQueryParam();

      const { data } = await axios.get<{ value: IOperatorWorkGroupJobTypeContractor[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypeContractors',
        { params }
      );

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchAutocompleteContractorsForValidationSuccess(payload, total));
      resolve(payload);
    } catch (error) {
      dispatch(fetchAutocompleteContractorsForValidationFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchAutocompleteContractorsForValidationRequest>
  | ReturnType<typeof fetchAutocompleteContractorsForValidationSuccess>
  | ReturnType<typeof fetchAutocompleteContractorsForValidationFailure>;
