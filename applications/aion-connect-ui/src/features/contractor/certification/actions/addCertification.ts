import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ICertification } from 'interfaces/certification';
import { ICertificationForm } from 'interfaces/certificationForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addCertificationRequest = () =>
  ({
    type: 'ADD_CERTIFICATION_REQUEST'
  } as const);

export const addCertificationSuccess = (payload: ICertification) =>
  ({
    type: 'ADD_CERTIFICATION_SUCCESS',
    payload
  } as const);

export const addCertificationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_CERTIFICATION_FAILURE',
    error
  } as const;
};

export const addCertification = (
  organizationId: string,
  values: ICertificationForm
): ThunkAction<Promise<ICertification>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addCertificationRequest());

      const { data } = await axios.post<ICertification>(
        `/api/v3.01/organizations(${organizationId})/certifications`,
        values
      );

      dispatch(addCertificationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addCertificationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addCertificationRequest>
  | ReturnType<typeof addCertificationSuccess>
  | ReturnType<typeof addCertificationFailure>;
