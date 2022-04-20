import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IContactInformation } from 'interfaces/contactInformation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const editContactInformationRequest = () =>
  ({
    type: 'EDIT_CONTACT_INFORMATION_REQUEST'
  } as const);

export const editContactInformationSuccess = (payload: IContactInformation) =>
  ({
    type: 'EDIT_CONTACT_INFORMATION_SUCCESS',
    payload
  } as const);

export const editContactInformationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_CONTACT_INFORMATION_FAILURE',
    error
  } as const;
};

export const editContactInformation = (
  organizationId: string,
  values: IContactInformation
): ThunkAction<Promise<IContactInformation>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editContactInformationRequest());

      const { data } = await axios.put<IContactInformation>(
        `/api/v3.01/organizations(${organizationId})/contactInformation(${values.id})`,
        values
      );

      dispatch(editContactInformationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editContactInformationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editContactInformationRequest>
  | ReturnType<typeof editContactInformationSuccess>
  | ReturnType<typeof editContactInformationFailure>;
