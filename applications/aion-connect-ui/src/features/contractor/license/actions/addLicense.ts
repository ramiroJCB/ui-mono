import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ILicense } from 'interfaces/license';
import { ILicenseForm } from 'interfaces/licenseForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addLicenseRequest = () =>
  ({
    type: 'ADD_LICENSE_REQUEST'
  } as const);

export const addLicenseSuccess = (payload: ILicense) =>
  ({
    type: 'ADD_LICENSE_SUCCESS',
    payload
  } as const);

export const addLicenseFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_LICENSE_FAILURE',
    error
  } as const;
};

export const addLicense = (
  organizationId: string,
  values: ILicenseForm
): ThunkAction<Promise<ILicense>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addLicenseRequest());

      const { data } = await axios.post<ILicense>(`/api/v3.01/organizations(${organizationId})/licenses`, values);

      dispatch(addLicenseSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addLicenseFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addLicenseRequest>
  | ReturnType<typeof addLicenseSuccess>
  | ReturnType<typeof addLicenseFailure>;
