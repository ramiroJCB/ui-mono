import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteAccreditationRequest = () =>
  ({
    type: 'DELETE_ACCREDITATION_REQUEST'
  } as const);

export const deleteAccreditationSuccess = (payload: string) =>
  ({
    type: 'DELETE_ACCREDITATION_SUCCESS',
    payload
  } as const);

export const deleteAccreditationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_ACCREDITATION_FAILURE',
    error
  } as const;
};

export const deleteAccreditation = (
  organizationId: string,
  accreditationId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteAccreditationRequest());

      await axios.delete(`/api/v3.01/organizations(${organizationId})/accreditations(${accreditationId})`);

      resolve();
    } catch (error) {
      dispatch(deleteAccreditationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteAccreditationRequest>
  | ReturnType<typeof deleteAccreditationSuccess>
  | ReturnType<typeof deleteAccreditationFailure>;
