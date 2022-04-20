import axios, { AxiosError } from 'axios';
import { IContractorJobTypeTrainingRequirement } from 'interfaces/contractorJobTypeTrainingRequirement';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchContractorJobTypeTrainingRequirementRequest = () =>
  ({
    type: 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENT_REQUEST'
  } as const);

const fetchContractorJobTypeTrainingRequirementSuccess = (payload: IContractorJobTypeTrainingRequirement) =>
  ({
    type: 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENT_SUCCESS',
    payload
  } as const);

const fetchContractorJobTypeTrainingRequirementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENT_FAILURE',
    error
  } as const;
};

const shouldFetchContractorJobTypeTrainingRequirement = (
  jobTypeTrainingRequirementId: string,
  { contractorJobTypeTrainingRequirement: { isFetching, contractorJobTypeTrainingRequirement } }: RootState
) =>
  (!contractorJobTypeTrainingRequirement && !isFetching) ||
  (contractorJobTypeTrainingRequirement && jobTypeTrainingRequirementId !== contractorJobTypeTrainingRequirement.id);

const fetchContractorJobTypeTrainingRequirement = (
  jobTypeTrainingRequirementId: string
): ThunkAction<Promise<IContractorJobTypeTrainingRequirement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchContractorJobTypeTrainingRequirementRequest());

      const params = new QueryBuilder().expand('trainingRequirement').toQueryParam();
      const { data } = await axios.get<IContractorJobTypeTrainingRequirement>(
        `/api/trainingCompliance/v3.01/jobTypeTrainingRequirementContractors(${jobTypeTrainingRequirementId})`,
        { params }
      );

      dispatch(fetchContractorJobTypeTrainingRequirementSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchContractorJobTypeTrainingRequirementFailure(error));
      reject(error);
    }
  });

export const fetchContractorJobTypeTrainingRequirementIfNeeded = (
  jobTypeTrainingRequirementId: string
): ThunkAction<Promise<IContractorJobTypeTrainingRequirement>, RootState, null, Actions> => (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    try {
      if (shouldFetchContractorJobTypeTrainingRequirement(jobTypeTrainingRequirementId, getState())) {
        const data = await dispatch(fetchContractorJobTypeTrainingRequirement(jobTypeTrainingRequirementId));
        resolve(data);
      } else {
        const { contractorJobTypeTrainingRequirement } = getState().contractorJobTypeTrainingRequirement;
        contractorJobTypeTrainingRequirement && resolve(contractorJobTypeTrainingRequirement);
      }
    } catch (error) {
      dispatch(fetchContractorJobTypeTrainingRequirementFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchContractorJobTypeTrainingRequirementRequest>
  | ReturnType<typeof fetchContractorJobTypeTrainingRequirementSuccess>
  | ReturnType<typeof fetchContractorJobTypeTrainingRequirementFailure>;
