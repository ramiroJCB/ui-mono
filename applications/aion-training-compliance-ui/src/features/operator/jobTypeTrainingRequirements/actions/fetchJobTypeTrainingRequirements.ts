import axios, { AxiosError } from 'axios';
import { IOperatorJobTypeTrainingRequirement } from 'interfaces/operatorJobTypeTrainingRequirement';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialOperatorJobTypeTrainingRequirementsRequest = () =>
  ({
    type: 'FETCH_INITIAL_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST'
  } as const);

const fetchOperatorJobTypeTrainingRequirementsRequest = () =>
  ({
    type: 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST'
  } as const);

const fetchOperatorJobTypeTrainingRequirementsSuccess = (
  payload: IOperatorJobTypeTrainingRequirement[],
  totalCount: number
) =>
  ({
    type: 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENTS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchOperatorJobTypeTrainingRequirementsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENTS_FAILURE',
    error
  } as const;
};

export const fetchOperatorJobTypeTrainingRequirements = (
  jobTypeId: string,
  top: number = 0,
  skip: number = 0,
  trainingRequirementName?: string | string[]
): ThunkAction<Promise<IOperatorJobTypeTrainingRequirement[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(
        (top === 0
          ? fetchInitialOperatorJobTypeTrainingRequirementsRequest
          : fetchOperatorJobTypeTrainingRequirementsRequest)()
      );

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .expand('trainingRequirement')
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('jobTypeId', Equals, jobTypeId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('trainingRequirementName', Contains, trainingRequirementName)
        )
        .orderBy('trainingRequirementName')
        .toQueryParam();

      const response = await axios.get<{ value: IOperatorJobTypeTrainingRequirement[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/jobTypeTrainingRequirements',
        { params }
      );
      const jobTypeTrainingRequirements = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchOperatorJobTypeTrainingRequirementsSuccess(jobTypeTrainingRequirements, totalCount));
      resolve(jobTypeTrainingRequirements);
    } catch (error) {
      dispatch(fetchOperatorJobTypeTrainingRequirementsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialOperatorJobTypeTrainingRequirementsRequest>
  | ReturnType<typeof fetchOperatorJobTypeTrainingRequirementsRequest>
  | ReturnType<typeof fetchOperatorJobTypeTrainingRequirementsSuccess>
  | ReturnType<typeof fetchOperatorJobTypeTrainingRequirementsFailure>;
