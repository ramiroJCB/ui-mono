import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteProjectRequest = () =>
  ({
    type: 'DELETE_PROJECT_REQUEST'
  } as const);

export const deleteProjectSuccess = (payload: string) =>
  ({
    type: 'DELETE_PROJECT_SUCCESS',
    payload
  } as const);

export const deleteProjectFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_PROJECT_FAILURE',
    error
  } as const;
};

export const deleteProject = (
  organizationId: string,
  projectId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteProjectRequest());

      await axios.delete(`/api/v3.01/organizations(${organizationId})/projects(${projectId})`);

      resolve();
    } catch (error) {
      dispatch(deleteProjectFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteProjectRequest>
  | ReturnType<typeof deleteProjectSuccess>
  | ReturnType<typeof deleteProjectFailure>;
