import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteContactRequest = () =>
  ({
    type: 'DELETE_CONTACT_REQUEST'
  } as const);

export const deleteContactSuccess = (contactId: string) =>
  ({
    type: 'DELETE_CONTACT_SUCCESS',
    contactId
  } as const);

export const deleteContactFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_CONTACT_FAILURE',
    error
  } as const;
};

export const deleteContact = (
  organizationId: string,
  siteId: string,
  contactId: string,
  history: History
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      dispatch(deleteContactRequest());

      await axios.delete(`/api/v2/organizations(${organizationId})/sites(${siteId})/contacts(${contactId})`);

      dispatch(deleteContactSuccess(contactId));

      history.push(`/${organizationId}/sites/${siteId}/contacts`);

      resolve();
    } catch (error) {
      dispatch(deleteContactFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof deleteContactRequest>
  | ReturnType<typeof deleteContactSuccess>
  | ReturnType<typeof deleteContactFailure>;
