import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IContactInformation } from 'interfaces/contactInformation';
import { IContactInformationForm } from 'interfaces/contactInformationForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addContactInformationRequest = () =>
  ({
    type: 'ADD_CONTACT_INFORMATION_REQUEST'
  } as const);

export const addContactInformationSuccess = (payload: IContactInformation) =>
  ({
    type: 'ADD_CONTACT_INFORMATION_SUCCESS',
    payload
  } as const);

export const addContactInformationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_CONTACT_INFORMATION_FAILURE',
    error
  } as const;
};

export const addContactInformation = (
  organizationId: string,
  values: IContactInformationForm
): ThunkAction<Promise<IContactInformation>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addContactInformationRequest());

      const { data } = await axios.post<IContactInformation>(
        `/api/v3.01/organizations(${organizationId})/contactInformation`,
        values
      );

      dispatch(addContactInformationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addContactInformationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addContactInformationRequest>
  | ReturnType<typeof addContactInformationSuccess>
  | ReturnType<typeof addContactInformationFailure>;
