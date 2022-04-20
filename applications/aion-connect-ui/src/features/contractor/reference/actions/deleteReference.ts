import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteReferenceRequest = () =>
  ({
    type: 'DELETE_REFERENCE_REQUEST'
  } as const);

export const deleteReferenceSuccess = (payload: string) =>
  ({
    type: 'DELETE_REFERENCE_SUCCESS',
    payload
  } as const);

export const deleteReferenceFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_REFERENCE_FAILURE',
    error
  } as const;
};

export const deleteReference = (
  organizationId: string,
  referenceId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteReferenceRequest());

      await axios.delete(`/api/v3.01/organizations(${organizationId})/references(${referenceId})`);

      resolve();
    } catch (error) {
      dispatch(deleteReferenceFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteReferenceRequest>
  | ReturnType<typeof deleteReferenceSuccess>
  | ReturnType<typeof deleteReferenceFailure>;
