import Axios, { AxiosError } from 'axios';
import { CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { DeepReadonly } from 'utility-types';
import { IWorkGroupJobTypeEmployeeTraining } from '@pec/aion-ui-core/interfaces/workGroupJobTypeEmployeeTraining';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { ThunkAction } from 'redux-thunk';

const fetchEmployeeWorkTrainingsRequest = () =>
  ({
    type: 'FETCH_WORK_TRAININGS_REQUEST'
  } as const);

const fetchEmployeeWorkTrainingsSuccess = (payload: IWorkGroupJobTypeEmployeeTraining[]) =>
  ({
    type: 'FETCH_WORK_TRAININGS_SUCCESS',
    payload
  } as const);

const fetchEmployeeWorkTrainingsFailure = (error: AxiosError) => {
  return {
    type: 'FETCH_WORK_TRAININGS_FAILURE',
    error
  } as const;
};

export const fetchEmployeeWorkTrainings = (
  organizationId: string,
  employeeId: string,
  siteWorkgroupsIds: DeepReadonly<string[]>
): ThunkAction<Promise<IWorkGroupJobTypeEmployeeTraining[]>, CommonRootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchEmployeeWorkTrainingsRequest());

      const {
        data: {
          value: [{ id }]
        }
      } = await Axios.get('/api/trainingCompliance/v3.01/Employees', {
        params: {
          $filter: `employeeId eq ${employeeId}`
        }
      });

      const { Equals, In } = OdataComparator;
      const params = new QueryBuilder()
        .expand('trainingRequirement')
        .filter(({ filterBy }) =>
          filterBy('employeeId ', Equals, id)
            .filterBy('organizationId ', Equals, organizationId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('workGroupId', In, [...siteWorkgroupsIds])
        )
        .orderBy('trainingRequirementName')
        .toQueryParam();

      const {
        data: { value }
      } = await Axios.get<{ value: IWorkGroupJobTypeEmployeeTraining[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypeEmployeeJobTypeTrainingRequirements',
        { params }
      );

      dispatch(fetchEmployeeWorkTrainingsSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchEmployeeWorkTrainingsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchEmployeeWorkTrainingsRequest>
  | ReturnType<typeof fetchEmployeeWorkTrainingsSuccess>
  | ReturnType<typeof fetchEmployeeWorkTrainingsFailure>;
