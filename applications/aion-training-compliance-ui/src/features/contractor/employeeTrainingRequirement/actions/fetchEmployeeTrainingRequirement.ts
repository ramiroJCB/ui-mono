import axios, { AxiosError } from 'axios';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchEmployeeTrainingRequirementRequest = () =>
  ({
    type: 'FETCH_EMPLOYEE_TRAINING_REQUIREMENT_REQUEST'
  } as const);

const fetchEmployeeTrainingRequirementSuccess = (payload: IEmployeeTrainingRequirement) =>
  ({
    type: 'FETCH_EMPLOYEE_TRAINING_REQUIREMENT_SUCCESS',
    payload
  } as const);

const fetchEmployeeTrainingRequirementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_EMPLOYEE_TRAINING_REQUIREMENT_FAILURE',
    error
  } as const;
};

const shouldFetchEmployeeTrainingRequirement = (
  employeeTrainingRequirementId: string,
  { employeeTrainingRequirement: { isFetching, employeeTrainingRequirement } }: RootState
) =>
  (!employeeTrainingRequirement && !isFetching) ||
  (employeeTrainingRequirement && employeeTrainingRequirementId !== employeeTrainingRequirement.id);

export const fetchEmployeeTrainingRequirement = (
  employeeTrainingRequirementId: string
): ThunkAction<Promise<IEmployeeTrainingRequirement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchEmployeeTrainingRequirementRequest());

      const { Equals } = OdataComparator;

      const params = new QueryBuilder()
        .expand('trainingRequirement, metaData, employee')
        .filter(({ filterBy }) => filterBy('isDeleted', Equals, false))
        .toQueryParam();

      const { data } = await axios.get<IEmployeeTrainingRequirement>(
        `/api/trainingCompliance/v3.01/employeeTrainingRequirements(${employeeTrainingRequirementId})`,
        { params }
      );

      dispatch(fetchEmployeeTrainingRequirementSuccess(data));

      resolve(data);
    } catch (error) {
      dispatch(fetchEmployeeTrainingRequirementFailure(error));
      reject();
    }
  });

export const fetchEmployeeTrainingRequirementIfNeeded = (
  employeeTrainingRequirementId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchEmployeeTrainingRequirement(employeeTrainingRequirementId, getState())) {
    dispatch(fetchEmployeeTrainingRequirement(employeeTrainingRequirementId));
  }
};

export type Actions =
  | ReturnType<typeof fetchEmployeeTrainingRequirementRequest>
  | ReturnType<typeof fetchEmployeeTrainingRequirementSuccess>
  | ReturnType<typeof fetchEmployeeTrainingRequirementFailure>;
