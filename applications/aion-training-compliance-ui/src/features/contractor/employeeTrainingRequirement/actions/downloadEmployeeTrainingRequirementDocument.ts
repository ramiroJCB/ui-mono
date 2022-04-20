import axios, { AxiosError } from 'axios';
import FileSaver from 'file-saver';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IDocument } from 'interfaces/document';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const downloadEmployeeTrainingRequirementDocumentRequest = (payload: string) =>
  ({
    type: 'DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_REQUEST',
    payload
  } as const);

const downloadEmployeeTrainingRequirementDocumentSuccess = (payload: string) =>
  ({
    type: 'DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS',
    payload
  } as const);

const downloadEmployeeTrainingRequirementDocumentFailure = (payload: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_FAILURE',
    payload,
    error
  } as const;
};

export const downloadEmployeeTrainingRequirementDocument = ({
  id,
  fileName
}: IDocument): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(downloadEmployeeTrainingRequirementDocumentRequest(id));

    const { data, headers } = await axios.get<BlobPart>(
      `/files/trainingCompliance/v3.01/employeeTrainingRequirementDocuments(${id})`,
      {
        responseType: 'arraybuffer'
      }
    );

    const blob = new Blob([data], { type: headers['content-type'] });
    FileSaver.saveAs(blob, fileName);

    dispatch(downloadEmployeeTrainingRequirementDocumentSuccess(id));
  } catch (error) {
    dispatch(downloadEmployeeTrainingRequirementDocumentFailure(id, error));
    dispatch(
      enqueueSnackbar({
        message: i18next.t(
          'trainingCompliance.contractor.employeeTrainingRequirement.downloadingError',
          'There was an error downloading this file.'
        ),
        options: {
          variant: 'error'
        }
      })
    );
  }
};

export type Actions =
  | ReturnType<typeof downloadEmployeeTrainingRequirementDocumentRequest>
  | ReturnType<typeof downloadEmployeeTrainingRequirementDocumentSuccess>
  | ReturnType<typeof downloadEmployeeTrainingRequirementDocumentFailure>;
