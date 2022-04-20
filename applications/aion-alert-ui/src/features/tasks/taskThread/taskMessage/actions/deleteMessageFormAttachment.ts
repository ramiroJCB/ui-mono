import axios, { AxiosError } from 'axios';
import { FormApi } from 'final-form';
import { IMessage } from 'interfaces/message';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteMessageFormAttachmentRequest = (payload: string) =>
  ({
    type: 'DELETE_MESSAGE_FORM_ATTACHMENT_REQUEST',
    payload
  } as const);

const deleteMessageFormAttachmentSuccess = (payload: string) =>
  ({
    type: 'DELETE_MESSAGE_FORM_ATTACHMENT_SUCCESS',
    payload
  } as const);

const deleteMessageFormAttachmentFailure = (payload: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_MESSAGE_FORM_ATTACHMENT_FAILURE',
    payload,
    error
  } as const;
};

export const deleteMessageFormAttachment = (
  id: string,
  form: FormApi<IMessage>
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(deleteMessageFormAttachmentRequest(id));

    const attachmentIds = form.getState().values.attachments.filter(a => a.id !== id);

    await axios.delete(`/files/v3.01/messageAttachments(${id})`);
    form.change('attachments', attachmentIds);

    dispatch(deleteMessageFormAttachmentSuccess(id));
  } catch (error) {
    dispatch(deleteMessageFormAttachmentFailure(id, error));
  }
};

export type Actions =
  | ReturnType<typeof deleteMessageFormAttachmentRequest>
  | ReturnType<typeof deleteMessageFormAttachmentSuccess>
  | ReturnType<typeof deleteMessageFormAttachmentFailure>;
