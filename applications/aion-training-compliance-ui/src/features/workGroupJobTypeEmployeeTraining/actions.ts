import axios, { AxiosError } from 'axios';
import { IWorkGroupJobTypeEmployeeTraining } from '@pec/aion-ui-core/interfaces/workGroupJobTypeEmployeeTraining';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialWorkGroupJobTypeEmployeeTrainingRequest = () =>
  ({
    type: 'FETCH_INITIAL_WORK_GROUP_JOB_TYPE_EMPLOYEE_TRAINING_REQUEST'
  } as const);

const fetchWorkGroupJobTypeEmployeeTrainingRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_TRAINING_REQUEST'
  } as const);

const fetchWorkGroupJobTypeEmployeeTrainingSuccess = (
  payload: IWorkGroupJobTypeEmployeeTraining[],
  totalCount: number
) =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_TRAINING_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchWorkGroupJobTypeEmployeeTrainingFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_TRAINING_FAILURE',
    error
  } as const;
};

export const fetchWorkGroupJobTypeEmployeeTraining = (
  clientId: string,
  workGroupJobTypeEmployeeId: string,
  top: number = 0,
  skip: number = 0,
  trainingRequirementName?: string | string[]
): ThunkAction<Promise<IWorkGroupJobTypeEmployeeTraining[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(
        (top === 0
          ? fetchInitialWorkGroupJobTypeEmployeeTrainingRequest
          : fetchWorkGroupJobTypeEmployeeTrainingRequest)()
      );

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .expand('trainingRequirement')
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('organizationId', Equals, clientId)
            .filterBy('workGroupJobTypeEmployeeId', Equals, workGroupJobTypeEmployeeId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('trainingRequirementName', Contains, trainingRequirementName)
        )
        .orderBy('trainingRequirementName')
        .toQueryParam();

      const response = await axios.get<{ value: IWorkGroupJobTypeEmployeeTraining[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypeEmployeeJobTypeTrainingRequirements',
        { params }
      );
      const workGroupJobTypeEmployeeTraining = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchWorkGroupJobTypeEmployeeTrainingSuccess(workGroupJobTypeEmployeeTraining, totalCount));
      resolve(workGroupJobTypeEmployeeTraining);
    } catch (error) {
      dispatch(fetchWorkGroupJobTypeEmployeeTrainingFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialWorkGroupJobTypeEmployeeTrainingRequest>
  | ReturnType<typeof fetchWorkGroupJobTypeEmployeeTrainingRequest>
  | ReturnType<typeof fetchWorkGroupJobTypeEmployeeTrainingSuccess>
  | ReturnType<typeof fetchWorkGroupJobTypeEmployeeTrainingFailure>;
