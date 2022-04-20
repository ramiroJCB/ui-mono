import axios, { AxiosError } from 'axios';
import { defaultPage, defaultPageSize } from './containers/ClientContractorsTable';
import { IAssignee } from 'interfaces/assignee';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ThunkAction } from 'redux-thunk';

const { Contains, Equals } = OdataComparator;
const { AwaitingAction, Complete, Incomplete } = TaskStatus;

const fetchClientContractorsRequest = () =>
  ({
    type: 'FETCH_CLIENT_CONTRACTORS_REQUEST'
  } as const);

const fetchClientContractorsSuccess = (payload: IAssignee[], totalCount: number) =>
  ({
    type: 'FETCH_CLIENT_CONTRACTORS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchClientContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_CONTRACTORS_FAILURE',
    error
  } as const;
};

const shouldFetchClientContractors = ({ clientContractors: { isFetching } }: RootState) => !isFetching;

const fetchClientContractors = (
  organizationId: string,
  { assigneeName, page, pageSize, order, orderBy, status }: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchClientContractorsRequest());

    const top = Number(pageSize) || defaultPageSize;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;

    const odataParams = new QueryBuilder()
      .top(top)
      .skipByPage(page || defaultPage.toString(), top)
      .orderBy(sortOrder)
      .filter(f =>
        f
          .filterBy('ownerId', Equals, organizationId)
          .filterBy('assigneeName', Contains, assigneeName)
          .filterBy('status', Equals, status)
      )
      .toQueryParam();

    const response = await axios.get<{ value: IAssignee[]; '@odata.count': number }>(
      '/api/v3.01/assigneeTaskAggregates',
      {
        params: {
          ...odataParams,
          statusOrder: !sortOrder ? `${AwaitingAction},${Incomplete},${Complete}` : undefined
        }
      }
    );

    const clientContractors = response.data.value;
    const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

    dispatch(fetchClientContractorsSuccess(clientContractors, totalCount));
  } catch (error) {
    dispatch(fetchClientContractorsFailure(error));
  }
};

export const fetchClientContractorsIfNeeded = (
  organizationId: string,
  search: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchClientContractors(getState())) {
    dispatch(fetchClientContractors(organizationId, search));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientContractorsRequest>
  | ReturnType<typeof fetchClientContractorsSuccess>
  | ReturnType<typeof fetchClientContractorsFailure>;
