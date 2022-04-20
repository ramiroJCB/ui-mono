import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addWorkGroupJobTypesRequest = () =>
  ({
    type: 'ADD_WORK_GROUP_JOB_TYPES_REQUEST'
  } as const);

const addWorkGroupJobTypesSuccess = (payload: IWorkGroupJobType[]) =>
  ({
    type: 'ADD_WORK_GROUP_JOB_TYPES_SUCCESS',
    payload
  } as const);

const addWorkGroupJobTypesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_WORK_GROUP_JOB_TYPES_FAILURE',
    error
  } as const;
};

export const addWorkGroupJobTypes = (
  history: History,
  organizationId: string,
  workGroupId: string,
  jobTypes: IJobType[]
): ThunkAction<Promise<IWorkGroupJobType[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addWorkGroupJobTypesRequest());

      const { data } = await axios.post<IWorkGroupJobType[]>(
        `/api/trainingCompliance/v3.01/workGroups(${workGroupId})/jobTypes`,
        jobTypes.map(({ id }) => id)
      );

      dispatch(addWorkGroupJobTypesSuccess(data));
      resolve(data);
      history.push(`/${organizationId}/training-compliance/work-groups/${workGroupId}`);
    } catch (error) {
      dispatch(addWorkGroupJobTypesFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addWorkGroupJobTypesRequest>
  | ReturnType<typeof addWorkGroupJobTypesSuccess>
  | ReturnType<typeof addWorkGroupJobTypesFailure>;
