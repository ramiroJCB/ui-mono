import axios, { AxiosError } from 'axios';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchWorkGroupRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_REQUEST'
  } as const);

const fetchWorkGroupSuccess = (payload: IWorkGroup) =>
  ({
    type: 'FETCH_WORK_GROUP_SUCCESS',
    payload
  } as const);

const fetchWorkGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_FAILURE',
    error
  } as const;
};

const shouldFetchWorkGroup = (workGroupId: string, { workGroup: { isFetching, workGroup } }: RootState) =>
  (!workGroup && !isFetching) || (workGroup && workGroupId !== workGroup.id);

const fetchWorkGroup = (workGroupId: string): ThunkAction<void, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchWorkGroupRequest());

      const params = new QueryBuilder().expand('serviceRegions').toQueryParam();

      const { data } = await axios.get<IWorkGroup>(`/api/trainingCompliance/v3.01/workGroups(${workGroupId})`, {
        params
      });
      dispatch(fetchWorkGroupSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchWorkGroupFailure(error));
      reject(error);
    }
  });

export const fetchWorkGroupIfNeeded = (workGroupId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchWorkGroup(workGroupId, getState())) {
    dispatch(fetchWorkGroup(workGroupId));
  }
};

export type Actions =
  | ReturnType<typeof fetchWorkGroupRequest>
  | ReturnType<typeof fetchWorkGroupSuccess>
  | ReturnType<typeof fetchWorkGroupFailure>;
