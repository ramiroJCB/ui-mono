import axios, { AxiosError } from 'axios';
import FileSaver from 'file-saver';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const downloadMessageAttachmentRequest = (payload: string) =>
  ({
    type: 'DOWNLOAD_MESSAGE_ATTACHMENT_REQUEST',
    payload
  } as const);

const downloadMessageAttachmentSuccess = (payload: string) =>
  ({
    type: 'DOWNLOAD_MESSAGE_ATTACHMENT_SUCCESS',
    payload
  } as const);

const downloadMessageAttachmentFailure = (payload: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'DOWNLOAD_MESSAGE_ATTACHMENT_FAILURE',
    payload,
    error
  } as const;
};

export const downloadMessageAttachment = ({
  id,
  fileName
}: IAttachment): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(downloadMessageAttachmentRequest(id));

    const { data, headers } = await axios.get<BlobPart>(`/files/v3.01/messageAttachments(${id})`, {
      responseType: 'arraybuffer'
    });

    const blob = new Blob([data], { type: headers['content-type'] });

    FileSaver.saveAs(blob, fileName);

    dispatch(downloadMessageAttachmentSuccess(id));
  } catch (error) {
    dispatch(downloadMessageAttachmentFailure(id, error));
  }
};

export type Actions =
  | ReturnType<typeof downloadMessageAttachmentRequest>
  | ReturnType<typeof downloadMessageAttachmentSuccess>
  | ReturnType<typeof downloadMessageAttachmentFailure>;
