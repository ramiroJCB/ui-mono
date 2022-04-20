import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IProject } from 'interfaces/project';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const editProjectRequest = () =>
  ({
    type: 'EDIT_PROJECT_REQUEST'
  } as const);

export const editProjectSuccess = (payload: IProject) =>
  ({
    type: 'EDIT_PROJECT_SUCCESS',
    payload
  } as const);

export const editProjectFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_PROJECT_FAILURE',
    error
  } as const;
};

export const editProject = (
  organizationId: string,
  values: IProject
): ThunkAction<Promise<IProject>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editProjectRequest());

      const { data } = await axios.put<IProject>(
        `/api/v3.01/organizations(${organizationId})/projects(${values.id})`,
        values
      );

      dispatch(editProjectSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editProjectFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editProjectRequest>
  | ReturnType<typeof editProjectSuccess>
  | ReturnType<typeof editProjectFailure>;
