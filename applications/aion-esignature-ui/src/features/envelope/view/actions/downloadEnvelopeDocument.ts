import axios, { AxiosError } from 'axios';
import FileSaver from 'file-saver';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IEnvelopeDocument } from '@pec/aion-ui-core/interfaces/envelopeDocument';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const downloadEnvelopeDocumentRequest = (payload: string) =>
  ({
    type: 'DOWNLOAD_ENVELOPE_DOCUMENT_REQUEST',
    payload
  } as const);

const downloadEnvelopeDocumentSuccess = (payload: string) =>
  ({
    type: 'DOWNLOAD_ENVELOPE_DOCUMENT_SUCCESS',
    payload
  } as const);

const downloadEnvelopeDocumentFailure = (payload: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'DOWNLOAD_ENVELOPE_DOCUMENT_FAILURE',
    payload,
    error
  } as const;
};

const shouldDownloadDocument = (documentId: string, { envelope: { downloadingDocumentIds } }: RootState) =>
  !downloadingDocumentIds.includes(documentId);

const downloadEnvelopeDocument = ({
  fileName,
  id
}: IEnvelopeDocument): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(downloadEnvelopeDocumentRequest(id));

    const { data, headers } = await axios.get<BlobPart>(`/files/v3.01/esignatureCompletedDocuments(${id})`, {
      responseType: 'arraybuffer'
    });

    const blob = new Blob([data], { type: headers['content-type'] });

    FileSaver.saveAs(blob, fileName);

    dispatch(downloadEnvelopeDocumentSuccess(id));
  } catch (error) {
    dispatch(
      enqueueSnackbar({
        message: i18next.t(
          'eSignature.envelope.view.documentDownloadingError',
          'An error occurred downloading this document.'
        ),
        options: {
          variant: 'error'
        }
      })
    );

    dispatch(downloadEnvelopeDocumentFailure(id, error));
  }
};

export const downloadEnvelopeDocumentIfNeeded = (
  document: IEnvelopeDocument
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldDownloadDocument(document.id, getState())) {
    dispatch(downloadEnvelopeDocument(document));
  }
};

export type Actions =
  | ReturnType<typeof downloadEnvelopeDocumentRequest>
  | ReturnType<typeof downloadEnvelopeDocumentSuccess>
  | ReturnType<typeof downloadEnvelopeDocumentFailure>;
