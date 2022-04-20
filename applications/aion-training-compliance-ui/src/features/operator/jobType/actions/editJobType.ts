import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const editJobTypeRequest = () =>
  ({
    type: 'EDIT_JOB_TYPE_REQUEST'
  } as const);

const editJobTypeSuccess = (payload: IJobType) =>
  ({
    type: 'EDIT_JOB_TYPE_SUCCESS',
    payload
  } as const);

const editJobTypeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_JOB_TYPE_FAILURE',
    error
  } as const;
};

export const editJobType = (
  jobTypeId: string,
  values: IJobType
): ThunkAction<Promise<IJobType>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editJobTypeRequest());

      const { data } = await axios.put<IJobType>(`/api/trainingCompliance/v3.01/jobTypes(${jobTypeId})`, values);

      dispatch(editJobTypeSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editJobTypeFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editJobTypeRequest>
  | ReturnType<typeof editJobTypeSuccess>
  | ReturnType<typeof editJobTypeFailure>;
