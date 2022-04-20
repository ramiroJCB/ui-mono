import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const editWorkGroupRequest = () =>
  ({
    type: 'EDIT_WORK_GROUP_REQUEST'
  } as const);

const editWorkGroupSuccess = (payload: IWorkGroup) =>
  ({
    type: 'EDIT_WORK_GROUP_SUCCESS',
    payload
  } as const);

const editWorkGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_WORK_GROUP_FAILURE',
    error
  } as const;
};

export const editWorkGroup = (
  workGroupId: string,
  values: IWorkGroup
): ThunkAction<Promise<IWorkGroup>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editWorkGroupRequest());

      const { data } = await axios.put<IWorkGroup>(`/api/trainingCompliance/v3.01/workGroups(${workGroupId})`, values);

      dispatch(editWorkGroupSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editWorkGroupFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editWorkGroupRequest>
  | ReturnType<typeof editWorkGroupSuccess>
  | ReturnType<typeof editWorkGroupFailure>;
