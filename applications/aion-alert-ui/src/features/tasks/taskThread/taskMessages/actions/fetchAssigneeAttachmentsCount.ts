import axios, { AxiosError } from 'axios';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const { Any, Equals } = OdataComparator;

const fetchAssigneeAttachmentsCountSuccess = (payload: number) =>
  ({
    type: 'FETCH_ASSIGNEE_ATTACHMENTS_COUNT_SUCCESS',
    payload
  } as const);

const fetchAssigneeAttachmentsCountFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_ASSIGNEE_ATTACHMENTS_COUNT_FAILURE',
    error
  } as const;
};

export const fetchAssigneeAttachmentsCount = (
  taskId: string,
  threadId: string,
  senderId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    const params = new QueryBuilder()
      .expand('attachments')
      .top(0)
      .filter(f => f.filterBy('senderId', Equals, senderId).filterBy('attachments', Any, undefined))
      .toQueryParam();

    const { data } = await axios.get<{ '@odata.count': number }>(
      `/api/v3.01/tasks(${taskId})/threads(${threadId})/messages`,
      {
        params
      }
    );
    dispatch(fetchAssigneeAttachmentsCountSuccess(data['@odata.count']));
  } catch (error) {
    dispatch(fetchAssigneeAttachmentsCountFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof fetchAssigneeAttachmentsCountSuccess>
  | ReturnType<typeof fetchAssigneeAttachmentsCountFailure>;
