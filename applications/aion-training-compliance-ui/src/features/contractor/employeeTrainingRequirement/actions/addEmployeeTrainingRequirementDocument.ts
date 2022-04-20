import axios, { AxiosError } from 'axios';
import { fetchEmployeeTrainingRequirement } from './fetchEmployeeTrainingRequirement';
import { FileWithPath } from 'react-dropzone';
import { getMimeType } from '@pec/aion-ui-core/helpers/file';
import { IDocument } from 'interfaces/document';
import { InvalidFileUpload } from '@pec/aion-ui-core/interfaces/invalidFileUpload';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addEmployeeTrainingRequirementDocumentRequest = (payload: FileWithPath[], rejectedFiles: InvalidFileUpload[]) =>
  ({
    type: 'ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_REQUEST',
    payload,
    rejectedFiles
  } as const);

const addEmployeeTrainingRequirementDocumentSuccess = (payload: IDocument) =>
  ({
    type: 'ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS',
    payload
  } as const);

const addEmployeeTrainingRequirementDocumentFailure = (error: AxiosError, fileName: string) => {
  sendError(error);
  return {
    type: 'ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_FAILURE',
    error,
    fileName
  } as const;
};

export const addEmployeeTrainingRequirementDocument = (
  employeeTrainingRequirementId: string,
  acceptedFiles: FileWithPath[],
  rejectedFiles: InvalidFileUpload[]
): ThunkAction<Promise<IDocument[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async resolve => {
    const documents: IDocument[] = [];

    dispatch(addEmployeeTrainingRequirementDocumentRequest(acceptedFiles, rejectedFiles));

    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append(
          'value',
          new Blob([file], { type: file.type || getMimeType(file) }),
          encodeURIComponent(file.name)
        );

        const { data } = await axios.post<IDocument>(
          `/api/trainingCompliance/v3.01/employeeTrainingRequirements(${employeeTrainingRequirementId})/documents`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        documents.push(data);
        dispatch(addEmployeeTrainingRequirementDocumentSuccess(data));
        dispatch(fetchEmployeeTrainingRequirement(employeeTrainingRequirementId));
      } catch (error) {
        dispatch(addEmployeeTrainingRequirementDocumentFailure(error, file.name));
      }
    }

    resolve(documents);
  });

export type Actions =
  | ReturnType<typeof addEmployeeTrainingRequirementDocumentRequest>
  | ReturnType<typeof addEmployeeTrainingRequirementDocumentSuccess>
  | ReturnType<typeof addEmployeeTrainingRequirementDocumentFailure>;
