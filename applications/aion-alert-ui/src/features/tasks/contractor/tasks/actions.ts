import axios, { AxiosError } from 'axios';
import { defaultPage, defaultPageSize } from './containers/ContractorTasksTable';
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

const fetchContractorTasksRequest = () =>
  ({
    type: 'FETCH_CONTRACTOR_TASKS_REQUEST'
  } as const);

const fetchContractorTasksSuccess = (payload: ITask[], totalCount: number) =>
  ({
    type: 'FETCH_CONTRACTOR_TASKS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchContractorTasksFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTOR_TASKS_FAILURE',
    error
  } as const;
};

export const fetchContractorTasks = (
  contractorId: string,
  { clientName, dueDateUtc, order, orderBy, page, pageSize, status, taskGroupSubject, taskNumber }: ParsedUrlQuery,
  organizationId?: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchContractorTasksRequest());

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
          .filterBy('clientId', Equals, organizationId)
          .filterBy('contractorId', Equals, contractorId)
          .filterBy('status', In, status, {
            valueType: FilterOptionValueType.EnumType
          })
          .filterBy('clientName', Contains, clientName)
          .filterBy('taskGroupSubject', Contains, taskGroupSubject)
          .filterBy('taskNumber', Contains, taskNumber)
          .filterBy('dueDateUtc', Equals, dueDateUtc)
      )
      .toQueryParam();

    const response = await axios.get<{ value: ITask[]; '@odata.count': number }>('/api/v3.01/contractorTasks', {
      params: {
        ...odataParams,
        statusOrder: !sortOrder
          ? `${OwnerReplied},${Incomplete},${AssigneeReplied},${Submitted},${Complete}`
          : undefined
      }
    });

    const contractorTasks = response.data.value;
    const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

    dispatch(fetchContractorTasksSuccess(contractorTasks, totalCount));
  } catch (error) {
    dispatch(fetchContractorTasksFailure(error));
  }
};

const shouldFetchContractorTasks = ({ contractorTasks: { isFetching } }: RootState) => !isFetching;

export const fetchContractorTasksIfNeeded = (
  contractorId: string,
  search: ParsedUrlQuery,
  organizationId?: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchContractorTasks(getState())) {
    dispatch(fetchContractorTasks(contractorId, search, organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchContractorTasksRequest>
  | ReturnType<typeof fetchContractorTasksSuccess>
  | ReturnType<typeof fetchContractorTasksFailure>;
