import axios, { AxiosError } from 'axios';
import { IOperatorJobTypeTrainingRequirement } from 'interfaces/operatorJobTypeTrainingRequirement';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchOperatorJobTypeTrainingRequirementRequest = () =>
  ({
    type: 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENT_REQUEST'
  } as const);

const fetchOperatorJobTypeTrainingRequirementSuccess = (payload: IOperatorJobTypeTrainingRequirement) =>
  ({
    type: 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENT_SUCCESS',
    payload
  } as const);

const fetchOperatorJobTypeTrainingRequirementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENT_FAILURE',
    error
  } as const;
};

const shouldFetchOperatorJobTypeTrainingRequirement = (
  jobTypeTrainingRequirementId: string,
  { operatorJobTypeTrainingRequirement: { isFetching, operatorJobTypeTrainingRequirement } }: RootState
) =>
  (!operatorJobTypeTrainingRequirement && !isFetching) ||
  (operatorJobTypeTrainingRequirement && jobTypeTrainingRequirementId !== operatorJobTypeTrainingRequirement.id);

const fetchOperatorJobTypeTrainingRequirement = (
  jobTypeTrainingRequirementId: string
): ThunkAction<Promise<IOperatorJobTypeTrainingRequirement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchOperatorJobTypeTrainingRequirementRequest());

      const params = new QueryBuilder().expand('trainingRequirement').toQueryParam();

      const { data } = await axios.get<IOperatorJobTypeTrainingRequirement>(
        `/api/trainingCompliance/v3.01/jobTypeTrainingRequirements(${jobTypeTrainingRequirementId})`,
        { params }
      );

      dispatch(fetchOperatorJobTypeTrainingRequirementSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchOperatorJobTypeTrainingRequirementFailure(error));
      reject(error);
    }
  });

export const fetchOperatorJobTypeTrainingRequirementIfNeeded = (
  jobTypeTrainingRequirementId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchOperatorJobTypeTrainingRequirement(jobTypeTrainingRequirementId, getState())) {
    dispatch(fetchOperatorJobTypeTrainingRequirement(jobTypeTrainingRequirementId));
  }
};

export type Actions =
  | ReturnType<typeof fetchOperatorJobTypeTrainingRequirementRequest>
  | ReturnType<typeof fetchOperatorJobTypeTrainingRequirementSuccess>
  | ReturnType<typeof fetchOperatorJobTypeTrainingRequirementFailure>;
