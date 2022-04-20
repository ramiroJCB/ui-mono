import axios, { AxiosError } from 'axios';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchWorkGroupJobTypeRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_REQUEST'
  } as const);

const fetchWorkGroupJobTypeSuccess = (payload: IWorkGroupJobType) =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_SUCCESS',
    payload
  } as const);

const fetchWorkGroupJobTypeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_JOB_TYPE_FAILURE',
    error
  } as const;
};

const shouldFetchWorkGroupJobType = (
  workGroupJobTypeId: string,
  { workGroupJobType: { isFetching, workGroupJobType } }: RootState
) => (!workGroupJobType && !isFetching) || (workGroupJobType && workGroupJobTypeId !== workGroupJobType.id);

const fetchWorkGroupJobType = (
  workGroupJobTypeId: string
): ThunkAction<Promise<IWorkGroupJobType>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchWorkGroupJobTypeRequest());

      const params = new QueryBuilder().expand('jobType').toQueryParam();
      const { data } = await axios.get<IWorkGroupJobType>(
        `/api/trainingCompliance/v3.01/workGroupJobTypes(${workGroupJobTypeId})`,
        { params }
      );

      dispatch(fetchWorkGroupJobTypeSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchWorkGroupJobTypeFailure(error));
      reject();
    }
  });

export const fetchWorkGroupJobTypeIfNeeded = (
  workGroupJobTypeId: string
): ThunkAction<Promise<IWorkGroupJobType | null>, RootState, null, Actions> => (dispatch, getState) =>
  new Promise(async resolve => {
    if (shouldFetchWorkGroupJobType(workGroupJobTypeId, getState())) {
      const data = await dispatch(fetchWorkGroupJobType(workGroupJobTypeId));
      resolve(data);
    } else {
      const { workGroupJobType } = getState().workGroupJobType;
      resolve(workGroupJobType);
    }
  });

export type Actions =
  | ReturnType<typeof fetchWorkGroupJobTypeRequest>
  | ReturnType<typeof fetchWorkGroupJobTypeSuccess>
  | ReturnType<typeof fetchWorkGroupJobTypeFailure>;
