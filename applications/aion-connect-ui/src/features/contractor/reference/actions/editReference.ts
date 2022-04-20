import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IReference } from 'interfaces/reference';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const editReferenceRequest = () =>
  ({
    type: 'EDIT_REFERENCE_REQUEST'
  } as const);

export const editReferenceSuccess = (payload: IReference) =>
  ({
    type: 'EDIT_REFERENCE_SUCCESS',
    payload
  } as const);

export const editReferenceFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_REFERENCE_FAILURE',
    error
  } as const;
};

export const editReference = (
  organizationId: string,
  values: IReference
): ThunkAction<Promise<IReference>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editReferenceRequest());

      const { data } = await axios.put<IReference>(
        `/api/v3.01/organizations(${organizationId})/references(${values.id})`,
        values
      );

      dispatch(editReferenceSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editReferenceFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editReferenceRequest>
  | ReturnType<typeof editReferenceSuccess>
  | ReturnType<typeof editReferenceFailure>;
