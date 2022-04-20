import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ICertification } from 'interfaces/certification';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const editCertificationRequest = () =>
  ({
    type: 'EDIT_CERTIFICATION_REQUEST'
  } as const);

export const editCertificationSuccess = (payload: ICertification) =>
  ({
    type: 'EDIT_CERTIFICATION_SUCCESS',
    payload
  } as const);

export const editCertificationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_CERTIFICATION_FAILURE',
    error
  } as const;
};

export const editCertification = (
  organizationId: string,
  values: ICertification
): ThunkAction<Promise<ICertification>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editCertificationRequest());

      const { data } = await axios.put<ICertification>(
        `/api/v3.01/organizations(${organizationId})/certifications(${values.id})`,
        values
      );

      dispatch(editCertificationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editCertificationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editCertificationRequest>
  | ReturnType<typeof editCertificationSuccess>
  | ReturnType<typeof editCertificationFailure>;
