import { RootState } from 'combineReducers';
import { ThunkAction } from 'redux-thunk';

const removeTaskGroupPendingAttachmentsRequest = () =>
  ({
    type: 'REMOVE_TASK_GROUP_PENDING_ATTACHMENTS'
  } as const);

export const removePendingAttachments = (): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  dispatch(removeTaskGroupPendingAttachmentsRequest());
};

export type Actions = ReturnType<typeof removeTaskGroupPendingAttachmentsRequest>;
