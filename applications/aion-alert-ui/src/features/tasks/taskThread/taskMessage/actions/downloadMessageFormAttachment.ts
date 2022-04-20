import axios, { AxiosError } from 'axios';
import FileSaver from 'file-saver';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const downloadMessageFormAttachmentRequest = (payload: string) =>
  ({
    type: 'DOWNLOAD_MESSAGE_FORM_ATTACHMENT_REQUEST',
    payload
  } as const);

const downloadMessageFormAttachmentSuccess = (payload: string) =>
  ({
    type: 'DOWNLOAD_MESSAGE_FORM_ATTACHMENT_SUCCESS',
    payload
  } as const);

const downloadMessageFormAttachmentFailure = (payload: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'DOWNLOAD_MESSAGE_FORM_ATTACHMENT_FAILURE',
    payload,
    error
  } as const;
};

export const downloadMessageFormAttachment = ({
  id,
  fileName
}: IAttachment): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(downloadMessageFormAttachmentRequest(id));

    const { data, headers } = await axios.get<BlobPart>(`/files/v3.01/messageAttachments(${id})`, {
      responseType: 'arraybuffer'
    });

    const blob = new Blob([data], { type: headers['content-type'] });

    FileSaver.saveAs(blob, fileName, { autoBom: true });

    dispatch(downloadMessageFormAttachmentSuccess(id));
  } catch (error) {
    dispatch(downloadMessageFormAttachmentFailure(id, error));
  }
};

export type Actions =
  | ReturnType<typeof downloadMessageFormAttachmentRequest>
  | ReturnType<typeof downloadMessageFormAttachmentSuccess>
  | ReturnType<typeof downloadMessageFormAttachmentFailure>;
