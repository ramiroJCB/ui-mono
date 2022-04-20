import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchEmployeeTrainingRequirement } from './fetchEmployeeTrainingRequirement';
import { RootState } from '../../../../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteEmployeeTrainingRequirementDocumentRequest = () =>
  ({
    type: 'DELETE_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_REQUEST'
  } as const);

const deleteEmployeeTrainingRequirementDocumentSuccess = (payload: string) =>
  ({
    type: 'DELETE_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS',
    payload
  } as const);

const deleteEmployeeTrainingRequirementDocumentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_FAILURE',
    error
  } as const;
};

export const deleteEmployeeTrainingRequirementDocument = (
  employeeTrainingRequirementId: string,
  documentId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteEmployeeTrainingRequirementDocumentRequest());

      await axios.delete(
        `/api/trainingCompliance/v3.01/employeeTrainingRequirements(${employeeTrainingRequirementId})/documents(${documentId})`
      );

      dispatch(deleteEmployeeTrainingRequirementDocumentSuccess(documentId));
      dispatch(fetchEmployeeTrainingRequirement(employeeTrainingRequirementId));
      resolve();
    } catch (error) {
      dispatch(deleteEmployeeTrainingRequirementDocumentFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteEmployeeTrainingRequirementDocumentRequest>
  | ReturnType<typeof deleteEmployeeTrainingRequirementDocumentSuccess>
  | ReturnType<typeof deleteEmployeeTrainingRequirementDocumentFailure>;
