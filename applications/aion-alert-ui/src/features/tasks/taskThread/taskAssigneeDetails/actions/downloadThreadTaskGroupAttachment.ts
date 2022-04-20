import axios, { AxiosError } from 'axios';
import FileSaver from 'file-saver';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const downloadThreadTaskGroupAttachmentRequest = (payload: string) =>
  ({
    type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_REQUEST',
    payload
  } as const);

const downloadThreadTaskGroupAttachmentSuccess = (payload: string) =>
  ({
    type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_SUCCESS',
    payload
  } as const);

const downloadThreadTaskGroupAttachmentFailure = (payload: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_FAILURE',
    payload,
    error
  } as const;
};

export const downloadThreadTaskGroupAttachment = ({
  id,
  fileName
}: IAttachment): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(downloadThreadTaskGroupAttachmentRequest(id));

    const { data, headers } = await axios.get<BlobPart>(`/files/v3.01/taskGroupAttachments(${id})`, {
      responseType: 'arraybuffer'
    });

    const blob = new Blob([data], { type: headers['content-type'] });

    FileSaver.saveAs(blob, fileName);

    dispatch(downloadThreadTaskGroupAttachmentSuccess(id));
  } catch (error) {
    dispatch(downloadThreadTaskGroupAttachmentFailure(id, error));
  }
};

export type Actions =
  | ReturnType<typeof downloadThreadTaskGroupAttachmentRequest>
  | ReturnType<typeof downloadThreadTaskGroupAttachmentSuccess>
  | ReturnType<typeof downloadThreadTaskGroupAttachmentFailure>;
