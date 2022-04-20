import axios, { AxiosError } from 'axios';
import { defaultPage, defaultPageSize } from './containers/TaskGroupsTable';
import { ITaskGroup, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const { Contains, Equals } = OdataComparator;
const { AwaitingAction, Complete, Incomplete } = TaskStatus;

const fetchTaskGroupsRequest = () =>
  ({
    type: 'FETCH_TASK_GROUPS_REQUEST'
  } as const);

const fetchTaskGroupsSuccess = (taskGroups: ITaskGroup[], totalCount: number) =>
  ({
    type: 'FETCH_TASK_GROUPS_SUCCESS',
    payload: taskGroups,
    totalCount
  } as const);

const fetchTaskGroupsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TASK_GROUPS_FAILURE',
    error
  } as const;
};

export const fetchTaskGroups = (
  organizationId: string,
  { dueDateUtc, order, orderBy, page, pageSize, status, subject }: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchTaskGroupsRequest());

    const top = Number(pageSize) || defaultPageSize;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;

    const odataParams = new QueryBuilder()
      .orderBy(sortOrder)
      .top(top)
      .skipByPage(page || defaultPage.toString(), top)
      .expand('attachments,assigneeGroups')
      .filter(f =>
        f
          .filterBy('dueDateUtc', Equals, dueDateUtc)
          .filterBy('status', Equals, status)
          .filterBy('subject', Contains, subject)
          .filterBy('ownerId', Equals, organizationId)
      )
      .toQueryParam();

    const response = await axios.get<{ value: ITaskGroup[]; '@odata.count': number }>('/api/v3.01/taskGroups', {
      params: {
        ...odataParams,
        statusOrder: !sortOrder ? `${AwaitingAction},${Incomplete},${Complete}` : undefined
      }
    });

    const taskGroups = response.data.value;
    const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

    dispatch(fetchTaskGroupsSuccess(taskGroups, totalCount));
  } catch (error) {
    dispatch(fetchTaskGroupsFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof fetchTaskGroupsRequest>
  | ReturnType<typeof fetchTaskGroupsSuccess>
  | ReturnType<typeof fetchTaskGroupsFailure>;
