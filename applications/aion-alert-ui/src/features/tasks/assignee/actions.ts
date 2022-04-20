import axios, { AxiosError } from 'axios';
import { IContractorAssignee } from 'interfaces/contractorAssignee';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const { Equals } = OdataComparator;

const fetchAssigneeRequest = () =>
  ({
    type: 'FETCH_ASSIGNEE_REQUEST'
  } as const);

const fetchAssigneeSuccess = (payload: IContractorAssignee) =>
  ({
    type: 'FETCH_ASSIGNEE_SUCCESS',
    payload
  } as const);

const fetchAssigneeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_ASSIGNEE_FAILURE',
    error
  } as const;
};

const shouldFetchAssignee = (assigneeId: string, { assignee: { assignee, isFetching } }: RootState) =>
  (!assignee && !isFetching) || (assignee && assigneeId !== assignee.id);

const fetchAssignee = (assigneeId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchAssigneeRequest());

    const params = new QueryBuilder().filter(f => f.filterBy('id', Equals, assigneeId)).toQueryParam();

    const {
      data: { value }
    } = await axios.get<{ value: IContractorAssignee[]; '@odata.count': number }>('/api/v3.00/organizations', {
      params
    });

    dispatch(fetchAssigneeSuccess(value[0]));
  } catch (error) {
    dispatch(fetchAssigneeFailure(error));
  }
};

export const fetchAssigneeIfNeeded = (assigneeId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchAssignee(assigneeId, getState())) {
    dispatch(fetchAssignee(assigneeId));
  }
};

export type Actions =
  | ReturnType<typeof fetchAssigneeRequest>
  | ReturnType<typeof fetchAssigneeSuccess>
  | ReturnType<typeof fetchAssigneeFailure>;
