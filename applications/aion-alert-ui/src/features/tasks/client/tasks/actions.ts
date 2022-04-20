import axios, { AxiosError } from 'axios';
import { defaultPage, defaultPageSize } from './containers/ClientTasksTable';
import { FilterOptionValueType } from '@pec/aion-ui-odata/types/odataFilterOption';
import { ITask } from '@pec/aion-ui-core/interfaces/task';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ThunkAction } from 'redux-thunk';

const { Contains, Equals, In } = OdataComparator;
const { AssigneeReplied, AwaitingAction, Complete, Incomplete, OwnerReplied, Submitted } = TaskStatus;

const fetchClientTasksRequest = () =>
  ({
    type: 'FETCH_CLIENT_TASKS_REQUEST'
  } as const);

const fetchClientTasksSuccess = (payload: ITask[], totalCount: number) =>
  ({
    type: 'FETCH_CLIENT_TASKS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchClientTasksFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_TASKS_FAILURE',
    error
  } as const;
};

export const fetchClientTasks = (
  clientId: string,
  { contractorName, dueDateUtc, order, orderBy, page, pageSize, status, taskGroupSubject, taskNumber }: ParsedUrlQuery,
  organizationId?: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchClientTasksRequest());

    const top = Number(pageSize) || defaultPageSize;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;

    if (status === AwaitingAction) {
      status = organizationId ? [AssigneeReplied, Submitted] : [OwnerReplied];
    } else if (status === Incomplete) {
      status = organizationId ? [Incomplete, OwnerReplied] : [Incomplete];
    } else {
      status = status && [status as TaskStatus];
    }

    const odataParams = new QueryBuilder()
      .orderBy(sortOrder)
      .top(top)
      .skipByPage(page || defaultPage.toString(), top)
      .filter(f =>
        f
          .filterBy('clientId', Equals, clientId)
          .filterBy('contractorId', Equals, organizationId)
          .filterBy('status', In, status, {
            valueType: FilterOptionValueType.EnumType
          })
          .filterBy('contractorName', Contains, contractorName)
          .filterBy('taskGroupSubject', Contains, taskGroupSubject)
          .filterBy('taskNumber', Contains, taskNumber)
          .filterBy('dueDateUtc', Equals, dueDateUtc)
      )
      .toQueryParam();

    const response = await axios.get<{ value: ITask[]; '@odata.count': number }>('/api/v3.01/contractorTasks', {
      params: {
        ...odataParams,
        statusOrder: !sortOrder
          ? `${AssigneeReplied},${Submitted},${OwnerReplied},${Incomplete},${Complete}`
          : undefined
      }
    });

    const clientTasks = response.data.value;
    const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

    dispatch(fetchClientTasksSuccess(clientTasks, totalCount));
  } catch (error) {
    dispatch(fetchClientTasksFailure(error));
  }
};

const shouldFetchClientTasks = ({ clientTasks: { isFetching } }: RootState) => !isFetching;

export const fetchClientTasksIfNeeded = (
  clientId: string,
  search: ParsedUrlQuery,
  organizationId?: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchClientTasks(getState())) {
    dispatch(fetchClientTasks(clientId, search, organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientTasksRequest>
  | ReturnType<typeof fetchClientTasksSuccess>
  | ReturnType<typeof fetchClientTasksFailure>;
