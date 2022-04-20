import axios, { AxiosError } from 'axios';
import { FileWithPath } from 'react-dropzone';
import { getMimeType } from 'helpers/file';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addTaskGroupAttachmentRequest = (payload: FileWithPath[], rejectedFiles: InvalidFileUpload[]) =>
  ({
    type: 'ADD_TASK_GROUP_ATTACHMENT_REQUEST',
    payload,
    rejectedFiles
  } as const);

export const addTaskGroupAttachmentSuccess = (payload: string, fileName: string) =>
  ({
    type: 'ADD_TASK_GROUP_ATTACHMENT_SUCCESS',
    payload,
    fileName
  } as const);

export const addTaskGroupAttachmentFailure = (error: AxiosError, fileName: string) => {
  sendError(error);
  return {
    type: 'ADD_TASK_GROUP_ATTACHMENT_FAILURE',
    error,
    fileName
  } as const;
};

export const addTaskGroupAttachment = (
  acceptedFiles: FileWithPath[],
  rejectedFiles: InvalidFileUpload[]
): ThunkAction<Promise<{ id: string }[]>, RootState, null, Actions> => async dispatch => {
  return new Promise(async resolve => {
    let attachmentIds: { id: string }[] = [];

    dispatch(addTaskGroupAttachmentRequest(acceptedFiles, rejectedFiles));

    for (const file of acceptedFiles) {
      const formData = new FormData();

      formData.append(
        'value',
        new Blob([file], { type: file.type || getMimeType(file) }),
        encodeURIComponent(file.name)
      );

      try {
        const { data } = await axios.post<{ id: string }>('/files/v3.01/taskGroupAttachments', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        attachmentIds.push(data);

        dispatch(addTaskGroupAttachmentSuccess(data.id, file.name));
      } catch (error) {
        dispatch(addTaskGroupAttachmentFailure(error, file.name));
      }
    }

    resolve(attachmentIds);
  });
};

export type Actions =
  | ReturnType<typeof addTaskGroupAttachmentRequest>
  | ReturnType<typeof addTaskGroupAttachmentSuccess>
  | ReturnType<typeof addTaskGroupAttachmentFailure>;
