import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { IContact } from 'interfaces/contact';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addContactRequest = () =>
  ({
    type: 'ADD_CONTACT_REQUEST'
  } as const);

export const addContactSuccess = (payload: IContact) =>
  ({
    type: 'ADD_CONTACT_SUCCESS',
    payload
  } as const);

export const addContactFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_CONTACT_FAILURE',
    error
  } as const;
};

export const addContact = (
  organizationId: string,
  contact: IContact,
  history: History
): ThunkAction<Promise<IContact>, RootState, null, Actions> => dispatch => {
  return new Promise<IContact>(async (resolve, reject) => {
    try {
      dispatch(addContactRequest());

      const { siteId } = contact;
      const response = await axios.post<IContact>(
        `/api/v2/organizations(${organizationId})/sites(${siteId})/contacts`,
        contact
      );

      const newContact = response.data;
      const { id: contactId } = newContact;

      dispatch(addContactSuccess(newContact));

      history.push(`/${organizationId}/sites/${siteId}/contacts/${contactId}`);

      resolve(newContact);
    } catch (error) {
      dispatch(addContactFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addContactRequest>
  | ReturnType<typeof addContactSuccess>
  | ReturnType<typeof addContactFailure>;
