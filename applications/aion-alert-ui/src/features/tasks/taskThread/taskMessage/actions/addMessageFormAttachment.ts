import axios, { AxiosError } from 'axios';
import { FileWithPath } from 'react-dropzone';
import { getMimeType } from 'helpers/file';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addMessageFormAttachmentRequest = (payload: FileWithPath[], rejectedFiles: InvalidFileUpload[]) =>
  ({
    type: 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST',
    payload,
    rejectedFiles
  } as const);

export const addMessageFormAttachmentSuccess = (payload: string, fileName: string) =>
  ({
    type: 'ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS',
    payload,
    fileName
  } as const);

export const addMessageFormAttachmentFailure = (error: AxiosError, fileName: string) => {
  sendError(error);
  return {
    type: 'ADD_MESSAGE_FORM_ATTACHMENT_FAILURE',
    error,
    fileName
  } as const;
};

export const addMessageFormAttachment = (
  acceptedFiles: FileWithPath[],
  rejectedFiles: InvalidFileUpload[]
): ThunkAction<Promise<{ id: string }[]>, RootState, null, Actions> => async dispatch => {
  return new Promise(async resolve => {
    let attachmentIds: { id: string }[] = [];

    dispatch(addMessageFormAttachmentRequest(acceptedFiles, rejectedFiles));

    for (const file of acceptedFiles) {
      const formData = new FormData();

      formData.append(
        'value',
        new Blob([file], { type: file.type || getMimeType(file) }),
        encodeURIComponent(file.name)
      );

      try {
        const { data } = await axios.post<{ id: string }>('/files/v3.01/messageAttachments', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        attachmentIds.push(data);

        dispatch(addMessageFormAttachmentSuccess(data.id, file.name));
      } catch (error) {
        dispatch(addMessageFormAttachmentFailure(error, file.name));
      }
    }

    resolve(attachmentIds);
  });
};

export type Actions =
  | ReturnType<typeof addMessageFormAttachmentRequest>
  | ReturnType<typeof addMessageFormAttachmentSuccess>
  | ReturnType<typeof addMessageFormAttachmentFailure>;
