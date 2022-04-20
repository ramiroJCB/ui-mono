import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteCertificationRequest = () =>
  ({
    type: 'DELETE_CERTIFICATION_REQUEST'
  } as const);

export const deleteCertificationSuccess = (payload: string) =>
  ({
    type: 'DELETE_CERTIFICATION_SUCCESS',
    payload
  } as const);

export const deleteCertificationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_CERTIFICATION_FAILURE',
    error
  } as const;
};

export const deleteCertification = (
  organizationId: string,
  certificationId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteCertificationRequest());

      await axios.delete(`/api/v3.01/organizations(${organizationId})/certifications(${certificationId})`);

      resolve();
    } catch (error) {
      dispatch(deleteCertificationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteCertificationRequest>
  | ReturnType<typeof deleteCertificationSuccess>
  | ReturnType<typeof deleteCertificationFailure>;
