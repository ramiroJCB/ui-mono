import axios, { AxiosError } from 'axios';
import { addWorkGroupJobTypes } from 'features/operator/workGroupJobTypes/actions/addWorkGroupJobTypes';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { IAddWorkGroupForm } from 'interfaces/addWorkGroupForm';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addWorkGroupRequest = () =>
  ({
    type: 'ADD_WORK_GROUP_REQUEST'
  } as const);

const addWorkGroupSuccess = (payload: IWorkGroup) =>
  ({
    type: 'ADD_WORK_GROUP_SUCCESS',
    payload
  } as const);

const addWorkGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_WORK_GROUP_FAILURE',
    error
  } as const;
};

export const addWorkGroup = (
  history: History,
  organizationId: string,
  values: IAddWorkGroupForm
): ThunkAction<Promise<IWorkGroup>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addWorkGroupRequest());

      const { jobTypes, ...addWorkGroup } = values;
      const { data } = await axios.post<IWorkGroup>('/api/trainingCompliance/v3.01/workGroups', addWorkGroup);

      jobTypes && jobTypes.length && (await dispatch(addWorkGroupJobTypes(history, organizationId, data.id, jobTypes)));

      dispatch(addWorkGroupSuccess(data));
      resolve(data);
      history.push(`/${organizationId}/training-compliance/work-groups/${data.id}`);
    } catch (error) {
      dispatch(addWorkGroupFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addWorkGroupRequest>
  | ReturnType<typeof addWorkGroupSuccess>
  | ReturnType<typeof addWorkGroupFailure>;
