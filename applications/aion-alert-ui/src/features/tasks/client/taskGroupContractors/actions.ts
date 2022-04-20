import axios from 'axios';
import { AxiosError } from 'axios';
import { defaultOrder, defaultOrderBy, defaultPage, defaultPageSize } from './containers/TaskGroupContractorsTable';
import { FilterOptionValueType } from '@pec/aion-ui-odata/types/odataFilterOption';
import { ITaskAssignee } from 'interfaces/taskAssignee';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ThunkAction } from 'redux-thunk';

const { Contains, In } = OdataComparator;
const { AssigneeReplied, AwaitingAction, Incomplete, OwnerReplied, Submitted } = TaskStatus;

const fetchTaskGroupContractorsRequest = () =>
  ({
    type: 'FETCH_TASK_GROUP_CONTRACTORS_REQUEST'
  } as const);

const fetchTaskGroupContractorsSuccess = (taskGroupContractors: ITaskAssignee[], totalCount: number) =>
  ({
    type: 'FETCH_TASK_GROUP_CONTRACTORS_SUCCESS',
    payload: taskGroupContractors,
    totalCount
  } as const);

const fetchTaskGroupContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TASK_GROUP_CONTRACTORS_FAILURE',
    error
  } as const;
};

const shouldFetchTaskGroupContractors = (
  { taskGroupContractors: { isFetching } }: RootState,
  { assigneeName }: ParsedUrlQuery
) => !isFetching || assigneeName;

const fetchTaskGroupContractors = (
  taskId: string,
  { page, pageSize, order, orderBy, status, assigneeName }: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchTaskGroupContractorsRequest());

    if (status === AwaitingAction) {
      status = [AssigneeReplied, Submitted];
    } else if (status === Incomplete) {
      status = [Incomplete, OwnerReplied];
    } else {
      status = status && [status as TaskStatus];
    }

    const top = Number(pageSize) || defaultPageSize;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : `${defaultOrderBy} ${defaultOrder}`;

    const params = new QueryBuilder()
      .orderBy(sortOrder)
      .top(top)
      .skipByPage(page || defaultPage.toString(), top)
      .filter(f =>
        f.filterBy('assigneeName', Contains, assigneeName).filterBy('status', In, status, {
          valueType: FilterOptionValueType.EnumType
        })
      )
      .toQueryParam();

    const response = await axios.get<{ value: ITaskAssignee[]; '@odata.count': number }>(
      `/api/v3.01/taskGroups(${taskId})/assigneeAggregates`,
      {
        params
      }
    );

    const taskAssignees = response.data.value;
    const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

    dispatch(fetchTaskGroupContractorsSuccess(taskAssignees, totalCount));
  } catch (error) {
    dispatch(fetchTaskGroupContractorsFailure(error));
  }
};

export const fetchTaskGroupContractorsIfNeeded = (
  taskId: string,
  search: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchTaskGroupContractors(getState(), search)) {
    dispatch(fetchTaskGroupContractors(taskId, search));
  }
};

export type Actions =
  | ReturnType<typeof fetchTaskGroupContractorsRequest>
  | ReturnType<typeof fetchTaskGroupContractorsSuccess>
  | ReturnType<typeof fetchTaskGroupContractorsFailure>;
