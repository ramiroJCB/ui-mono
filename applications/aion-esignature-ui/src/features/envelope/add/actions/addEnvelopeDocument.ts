import axios, { AxiosError } from 'axios';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { FileWithPath } from 'react-dropzone';
import { getMimeType } from 'helpers/file';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const addEnvelopeDocumentRequest = (payload: FileWithPath) =>
  ({
    type: 'ADD_ENVELOPE_DOCUMENT_REQUEST',
    payload
  } as const);

const addEnvelopeDocumentSuccess = (payload: string) =>
  ({
    type: 'ADD_ENVELOPE_DOCUMENT_SUCCESS',
    payload
  } as const);

const addEnvelopeDocumentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_ENVELOPE_DOCUMENT_FAILURE',
    error
  } as const;
};

export const addEnvelopeDocument = (
  document: FileWithPath
): ThunkAction<Promise<{ id: string }>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    dispatch(addEnvelopeDocumentRequest(document));

    const formData = new FormData();

    formData.append('value', new Blob([document], { type: document.type || getMimeType(document) }), document.name);

    try {
      const { data } = await axios.post<{ id: string }>('/files/v3.01/eSignatureDocuments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch(addEnvelopeDocumentSuccess(data.id));

      resolve(data);
    } catch (error) {
      dispatch(addEnvelopeDocumentFailure(error));

      dispatch(
        enqueueSnackbar({
          message: i18next.t('eSignature.envelope.add.documentUploadingFailed', 'Failed to upload document.'),
          options: {
            variant: 'error'
          }
        })
      );

      reject();
    }
  });
};

export type Actions =
  | ReturnType<typeof addEnvelopeDocumentRequest>
  | ReturnType<typeof addEnvelopeDocumentSuccess>
  | ReturnType<typeof addEnvelopeDocumentFailure>;
