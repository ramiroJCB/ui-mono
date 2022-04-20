import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteLicenseRequest = () =>
  ({
    type: 'DELETE_LICENSE_REQUEST'
  } as const);

export const deleteLicenseSuccess = (payload: string) =>
  ({
    type: 'DELETE_LICENSE_SUCCESS',
    payload
  } as const);

export const deleteLicenseFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_LICENSE_FAILURE',
    error
  } as const;
};

export const deleteLicense = (
  organizationId: string,
  licenseId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteLicenseRequest());

      await axios.delete(`/api/v3.01/organizations(${organizationId})/licenses(${licenseId})`);

      resolve();
    } catch (error) {
      dispatch(deleteLicenseFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteLicenseRequest>
  | ReturnType<typeof deleteLicenseSuccess>
  | ReturnType<typeof deleteLicenseFailure>;
