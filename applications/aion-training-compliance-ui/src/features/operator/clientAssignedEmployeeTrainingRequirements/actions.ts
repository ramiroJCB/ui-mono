import axios, { AxiosError } from 'axios';
import { IClientAssignedEmployeeTrainingRequirement } from 'interfaces/clientAssignedEmployeeTrainingRequirement';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialClientAssignedEmployeeTrainingRequirementsRequest = () =>
  ({
    type: 'FETCH_INITIAL_CLIENT_ASSIGNED_EMPLOYEE_TRAINING_REQUIREMENTS_REQUEST'
  } as const);

const fetchClientAssignedEmployeeTrainingRequirementsRequest = () =>
  ({
    type: 'FETCH_CLIENT_ASSIGNED_EMPLOYEE_TRAINING_REQUIREMENTS_REQUEST'
  } as const);

const fetchClientAssignedEmployeeTrainingRequirementsSuccess = (
  payload: IClientAssignedEmployeeTrainingRequirement[],
  totalCount: number
) =>
  ({
    type: 'FETCH_CLIENT_ASSIGNED_EMPLOYEE_TRAINING_REQUIREMENTS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchClientAssignedEmployeeTrainingRequirementsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_ASSIGNED_EMPLOYEE_TRAINING_REQUIREMENTS_FAILURE',
    error
  } as const;
};

export const fetchClientAssignedEmployeeTrainingRequirements = (
  clientId: string,
  employeeId: string,
  top: number = 0,
  skip: number = 0,
  name?: string | string[]
): ThunkAction<Promise<IClientAssignedEmployeeTrainingRequirement[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(
        (top === 0
          ? fetchInitialClientAssignedEmployeeTrainingRequirementsRequest
          : fetchClientAssignedEmployeeTrainingRequirementsRequest)()
      );

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .expand('trainingRequirement')
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('clientId', Equals, clientId)
            .filterBy('employeeId', Equals, employeeId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('trainingRequirementName', Contains, name)
        )
        .orderBy('trainingRequirementName')
        .toQueryParam();

      const response = await axios.get<{ value: IClientAssignedEmployeeTrainingRequirement[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/clientAssignedEmployeeTrainingRequirements',
        { params }
      );

      const clientAssignedEmployeeTrainingRequirements = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(
        fetchClientAssignedEmployeeTrainingRequirementsSuccess(clientAssignedEmployeeTrainingRequirements, totalCount)
      );
      resolve(clientAssignedEmployeeTrainingRequirements);
    } catch (error) {
      dispatch(fetchClientAssignedEmployeeTrainingRequirementsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialClientAssignedEmployeeTrainingRequirementsRequest>
  | ReturnType<typeof fetchClientAssignedEmployeeTrainingRequirementsRequest>
  | ReturnType<typeof fetchClientAssignedEmployeeTrainingRequirementsSuccess>
  | ReturnType<typeof fetchClientAssignedEmployeeTrainingRequirementsFailure>;
