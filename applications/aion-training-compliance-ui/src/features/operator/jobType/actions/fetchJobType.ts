import axios, { AxiosError } from 'axios';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchJobTypeRequest = () =>
  ({
    type: 'FETCH_JOB_TYPE_REQUEST'
  } as const);

const fetchJobTypeSuccess = (payload: IJobType) =>
  ({
    type: 'FETCH_JOB_TYPE_SUCCESS',
    payload
  } as const);

const fetchJobTypeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_JOB_TYPE_FAILURE',
    error
  } as const;
};

const shouldFetchJobType = (jobTypeId: string, { jobType: { isFetching, jobType } }: RootState) =>
  (!jobType && !isFetching) || (jobType && jobTypeId !== jobType.id);

const fetchJobType = (jobTypeId: string): ThunkAction<void, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchJobTypeRequest());

      const { data } = await axios.get<IJobType>(`/api/trainingCompliance/v3.01/jobTypes(${jobTypeId})`);

      dispatch(fetchJobTypeSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchJobTypeFailure(error));
      reject(error);
    }
  });

export const fetchJobTypeIfNeeded = (jobTypeId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchJobType(jobTypeId, getState())) {
    dispatch(fetchJobType(jobTypeId));
  }
};

export type Actions =
  | ReturnType<typeof fetchJobTypeRequest>
  | ReturnType<typeof fetchJobTypeSuccess>
  | ReturnType<typeof fetchJobTypeFailure>;
