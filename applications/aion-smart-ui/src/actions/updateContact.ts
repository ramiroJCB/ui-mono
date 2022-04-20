import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { IContact } from 'interfaces/contact';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const updateContactRequest = () =>
  ({
    type: 'UPDATE_CONTACT_REQUEST'
  } as const);

export const updateContactSuccess = (payload: IContact) =>
  ({
    type: 'UPDATE_CONTACT_SUCCESS',
    payload
  } as const);

export const updateContactFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_CONTACT_FAILURE',
    error
  } as const;
};

export const updateContact = (
  organizationId: string,
  contact: IContact,
  history: History
): ThunkAction<Promise<IContact>, RootState, null, Actions> => dispatch => {
  return new Promise<IContact>(async (resolve, reject) => {
    try {
      dispatch(updateContactRequest());

      const { siteId, id: contactId } = contact;
      const response = await axios.put<IContact>(
        `/api/v2/organizations(${organizationId})/sites(${siteId})/contacts(${contactId})`,
        contact
      );
      const updatedContact = response.data;

      dispatch(updateContactSuccess(updatedContact));

      history.push(`/${organizationId}/sites/${siteId}/contacts/${contactId}`);

      resolve(updatedContact);
    } catch (error) {
      dispatch(updateContactFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateContactRequest>
  | ReturnType<typeof updateContactSuccess>
  | ReturnType<typeof updateContactFailure>;
