import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IReference } from 'interfaces/reference';
import { IReferenceForm } from 'interfaces/referenceForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addReferenceRequest = () =>
  ({
    type: 'ADD_REFERENCE_REQUEST'
  } as const);

export const addReferenceSuccess = (payload: IReference) =>
  ({
    type: 'ADD_REFERENCE_SUCCESS',
    payload
  } as const);

export const addReferenceFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_REFERENCE_FAILURE',
    error
  } as const;
};

export const addReference = (
  organizationId: string,
  values: IReferenceForm
): ThunkAction<Promise<IReference>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addReferenceRequest());

      const { data } = await axios.post<IReference>(`/api/v3.01/organizations(${organizationId})/references`, values);

      dispatch(addReferenceSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addReferenceFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addReferenceRequest>
  | ReturnType<typeof addReferenceSuccess>
  | ReturnType<typeof addReferenceFailure>;
