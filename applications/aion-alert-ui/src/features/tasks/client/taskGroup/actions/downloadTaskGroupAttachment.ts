import axios, { AxiosError } from 'axios';
import FileSaver from 'file-saver';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const downloadTaskGroupAttachmentRequest = (payload: string) =>
  ({
    type: 'DOWNLOAD_TASK_GROUP_ATTACHMENT_REQUEST',
    payload
  } as const);

const downloadTaskGroupAttachmentSuccess = (payload: string) =>
  ({
    type: 'DOWNLOAD_TASK_GROUP_ATTACHMENT_SUCCESS',
    payload
  } as const);

const downloadTaskGroupAttachmentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DOWNLOAD_TASK_GROUP_ATTACHMENT_FAILURE',
    error
  } as const;
};

export const downloadTaskGroupAttachment = ({
  id,
  fileName
}: IAttachment): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(downloadTaskGroupAttachmentRequest(id));

    const { data, headers } = await axios.get<BlobPart>(`/files/v3.01/taskGroupAttachments(${id})`, {
      responseType: 'arraybuffer'
    });

    const blob = new Blob([data], { type: headers['content-type'] });

    FileSaver.saveAs(blob, fileName);

    dispatch(downloadTaskGroupAttachmentSuccess(id));
  } catch (error) {
    dispatch(downloadTaskGroupAttachmentFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof downloadTaskGroupAttachmentRequest>
  | ReturnType<typeof downloadTaskGroupAttachmentSuccess>
  | ReturnType<typeof downloadTaskGroupAttachmentFailure>;
