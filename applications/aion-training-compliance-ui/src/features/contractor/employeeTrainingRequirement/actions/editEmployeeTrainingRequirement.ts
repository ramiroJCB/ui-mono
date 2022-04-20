import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const editEmployeeTrainingRequirementRequest = () =>
  ({
    type: 'EDIT_EMPLOYEE_TRAINING_REQUIREMENT_REQUEST'
  } as const);

const editEmployeeTrainingRequirementSuccess = (payload: IEmployeeTrainingRequirement) =>
  ({
    type: 'EDIT_EMPLOYEE_TRAINING_REQUIREMENT_SUCCESS',
    payload
  } as const);

const editEmployeeTrainingRequirementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_EMPLOYEE_TRAINING_REQUIREMENT_FAILURE',
    error
  } as const;
};

export const editEmployeeTrainingRequirement = (
  employeeTrainingRequirementId: string,
  values: IEmployeeTrainingRequirement
): ThunkAction<Promise<IEmployeeTrainingRequirement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editEmployeeTrainingRequirementRequest());

      const { metaData, trainingRequirement, ...employeeTrainingRequirement } = values;
      const { data } = await axios.put<IEmployeeTrainingRequirement>(
        `/api/trainingCompliance/v3.01/employeeTrainingRequirements(${employeeTrainingRequirementId})`,
        employeeTrainingRequirement
      );
      const combinedEmployeeTrainingRequirement = { ...data, metaData, trainingRequirement };

      dispatch(editEmployeeTrainingRequirementSuccess(combinedEmployeeTrainingRequirement));
      resolve(combinedEmployeeTrainingRequirement);
    } catch (error) {
      dispatch(editEmployeeTrainingRequirementFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editEmployeeTrainingRequirementRequest>
  | ReturnType<typeof editEmployeeTrainingRequirementSuccess>
  | ReturnType<typeof editEmployeeTrainingRequirementFailure>;
