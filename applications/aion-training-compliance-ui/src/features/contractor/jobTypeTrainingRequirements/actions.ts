import axios, { AxiosError } from 'axios';
import { IContractorJobTypeTrainingRequirement } from 'interfaces/contractorJobTypeTrainingRequirement';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialContractorJobTypeTrainingRequirementsRequest = () =>
  ({
    type: 'FETCH_INITIAL_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST'
  } as const);

const fetchContractorJobTypeTrainingRequirementsRequest = () =>
  ({
    type: 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST'
  } as const);

const fetchContractorJobTypeTrainingRequirementsSuccess = (
  payload: IContractorJobTypeTrainingRequirement[],
  totalCount: number
) =>
  ({
    type: 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENTS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchContractorJobTypeTrainingRequirementsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENTS_FAILURE',
    error
  } as const;
};

export const fetchContractorJobTypeTrainingRequirements = (
  organizationId: string,
  jobTypeId: string,
  top: number = 0,
  skip: number = 0,
  trainingRequirementName?: string | string[]
): ThunkAction<Promise<IContractorJobTypeTrainingRequirement[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(
        (top === 0
          ? fetchInitialContractorJobTypeTrainingRequirementsRequest
          : fetchContractorJobTypeTrainingRequirementsRequest)()
      );

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .expand('trainingRequirement')
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('contractorOrganizationId', Equals, organizationId)
            .filterBy('jobTypeId', Equals, jobTypeId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('trainingRequirementName', Contains, trainingRequirementName)
        )
        .orderBy('trainingRequirementName')
        .toQueryParam();

      const response = await axios.get<{ value: IContractorJobTypeTrainingRequirement[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/jobTypeTrainingRequirementContractors',
        { params }
      );
      const jobTypeTrainingRequirements = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchContractorJobTypeTrainingRequirementsSuccess(jobTypeTrainingRequirements, totalCount));
      resolve(jobTypeTrainingRequirements);
    } catch (error) {
      dispatch(fetchContractorJobTypeTrainingRequirementsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialContractorJobTypeTrainingRequirementsRequest>
  | ReturnType<typeof fetchContractorJobTypeTrainingRequirementsRequest>
  | ReturnType<typeof fetchContractorJobTypeTrainingRequirementsSuccess>
  | ReturnType<typeof fetchContractorJobTypeTrainingRequirementsFailure>;
