import axios, { AxiosError } from 'axios';
import { ITaskAssigneeDetails } from 'interfaces/taskAssigneeDetails';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTaskAssigneeDetailsRequest = () =>
  ({
    type: 'FETCH_TASK_ASSIGNEE_DETAILS_REQUEST'
  } as const);

const fetchTaskAssigneeDetailsSuccess = (payload: ITaskAssigneeDetails) =>
  ({
    type: 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS',
    payload
  } as const);

const fetchTaskAssigneeDetailsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TASK_ASSIGNEE_DETAILS_FAILURE',
    error
  } as const;
};

const shouldFetchTaskAssigneeDetails = ({ taskAssigneeDetails: { isFetching } }: RootState) => !isFetching;

const fetchTaskAssigneeDetails = (taskId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchTaskAssigneeDetailsRequest());

    const { data } = await axios.get<ITaskAssigneeDetails>(`/api/v3.01/tasks(${taskId})`, {
      params: { $expand: 'assignees,statuses' }
    });

    dispatch(fetchTaskAssigneeDetailsSuccess(data));
  } catch (error) {
    dispatch(fetchTaskAssigneeDetailsFailure(error));
  }
};

export const fetchTaskAssigneeDetailsIfNeeded = (taskId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchTaskAssigneeDetails(getState())) {
    dispatch(fetchTaskAssigneeDetails(taskId));
  }
};

export type Actions =
  | ReturnType<typeof fetchTaskAssigneeDetailsRequest>
  | ReturnType<typeof fetchTaskAssigneeDetailsSuccess>
  | ReturnType<typeof fetchTaskAssigneeDetailsFailure>;
