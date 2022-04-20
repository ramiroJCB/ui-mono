import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IProject } from 'interfaces/project';
import { IProjectForm } from 'interfaces/projectForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addProjectRequest = () =>
  ({
    type: 'ADD_PROJECT_REQUEST'
  } as const);

export const addProjectSuccess = (payload: IProject) =>
  ({
    type: 'ADD_PROJECT_SUCCESS',
    payload
  } as const);

export const addProjectFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_PROJECT_FAILURE',
    error
  } as const;
};

export const addProject = (
  organizationId: string,
  values: IProjectForm
): ThunkAction<Promise<IProject>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addProjectRequest());

      const { data } = await axios.post<IProject>(`/api/v3.01/organizations(${organizationId})/projects`, values);

      dispatch(addProjectSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addProjectFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addProjectRequest>
  | ReturnType<typeof addProjectSuccess>
  | ReturnType<typeof addProjectFailure>;
