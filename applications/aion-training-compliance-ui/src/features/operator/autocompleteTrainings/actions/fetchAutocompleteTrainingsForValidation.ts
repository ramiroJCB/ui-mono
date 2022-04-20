import axios, { AxiosError } from 'axios';
import { IJobTypeTrainingRequirement } from 'interfaces/jobTypeTrainingRequirement';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteTrainingsForValidationRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_TRAININGS_FOR_VALIDATION_REQUEST'
  } as const);

const fetchAutocompleteTrainingsForValidationSuccess = (payload: IJobTypeTrainingRequirement[], totalCount: number) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_TRAININGS_FOR_VALIDATION_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchAutocompleteTrainingsForValidationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_TRAININGS_FOR_VALIDATION_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteTrainingsForValidation = (
  values: ITrainingRequirement[],
  jobTypeId: string
): ThunkAction<Promise<IJobTypeTrainingRequirement[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteTrainingsForValidationRequest());

      const { Equals, In } = OdataComparator;
      const params = new QueryBuilder()
        .filter(({ filterBy }) =>
          filterBy('isDeleted', Equals, false)
            .filterBy('jobTypeId', Equals, jobTypeId)
            .filterBy(
              'trainingRequirementId',
              In,
              values.map(({ id }) => id)
            )
        )
        .toQueryParam();

      const { data } = await axios.get<{ value: IJobTypeTrainingRequirement[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/jobTypeTrainingRequirements',
        { params }
      );

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchAutocompleteTrainingsForValidationSuccess(payload, total));
      resolve(payload);
    } catch (error) {
      dispatch(fetchAutocompleteTrainingsForValidationFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchAutocompleteTrainingsForValidationRequest>
  | ReturnType<typeof fetchAutocompleteTrainingsForValidationSuccess>
  | ReturnType<typeof fetchAutocompleteTrainingsForValidationFailure>;
