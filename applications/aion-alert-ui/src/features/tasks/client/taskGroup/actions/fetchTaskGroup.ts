import axios, { AxiosError } from 'axios';
import { ITaskGroup } from '@pec/aion-ui-core/interfaces/taskGroup';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTaskGroupRequest = () =>
  ({
    type: 'FETCH_TASK_GROUP_REQUEST'
  } as const);

const fetchTaskGroupSuccess = (payload: ITaskGroup) =>
  ({
    type: 'FETCH_TASK_GROUP_SUCCESS',
    payload
  } as const);

const fetchTaskGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TASK_GROUP_FAILURE',
    error
  } as const;
};

const shouldFetchTaskGroup = ({ taskGroup: { isFetching } }: RootState) => !isFetching;

const fetchTaskGroup = (taskGroupId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchTaskGroupRequest());

    const { data } = await axios.get<ITaskGroup>(`/api/v3.01/taskGroups(${taskGroupId})`, {
      params: { $expand: 'attachments' }
    });

    dispatch(fetchTaskGroupSuccess(data));
  } catch (error) {
    dispatch(fetchTaskGroupFailure(error));
  }
};

export const fetchTaskGroupIfNeeded = (taskGroupId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchTaskGroup(getState())) {
    dispatch(fetchTaskGroup(taskGroupId));
  }
};

export type Actions =
  | ReturnType<typeof fetchTaskGroupRequest>
  | ReturnType<typeof fetchTaskGroupSuccess>
  | ReturnType<typeof fetchTaskGroupFailure>;
