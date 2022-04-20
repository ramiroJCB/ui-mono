import { RootState } from 'combineReducers';
import { ThunkAction } from 'redux-thunk';

const removePendingMessageFormAttachmentsRequest = () =>
  ({
    type: 'REMOVE_PENDING_MESSAGE_FORM_ATTACHMENTS_REQUEST'
  } as const);

export const removePendingMessageFormAttachments = (): ThunkAction<
  void,
  RootState,
  null,
  Actions
> => async dispatch => {
  dispatch(removePendingMessageFormAttachmentsRequest());
};

export type Actions = ReturnType<typeof removePendingMessageFormAttachmentsRequest>;
