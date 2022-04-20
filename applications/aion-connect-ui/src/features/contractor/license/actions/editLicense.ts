import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ILicense } from 'interfaces/license';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const editLicenseRequest = () =>
  ({
    type: 'EDIT_LICENSE_REQUEST'
  } as const);

export const editLicenseSuccess = (payload: ILicense) =>
  ({
    type: 'EDIT_LICENSE_SUCCESS',
    payload
  } as const);

export const editLicenseFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_LICENSE_FAILURE',
    error
  } as const;
};

export const editLicense = (
  organizationId: string,
  values: ILicense
): ThunkAction<Promise<ILicense>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editLicenseRequest());

      const { data } = await axios.put<ILicense>(
        `/api/v3.01/organizations(${organizationId})/licenses(${values.id})`,
        values
      );

      dispatch(editLicenseSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editLicenseFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editLicenseRequest>
  | ReturnType<typeof editLicenseSuccess>
  | ReturnType<typeof editLicenseFailure>;
