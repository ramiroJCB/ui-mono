import axios, { AxiosError } from 'axios';
import { IContact } from 'interfaces/contact';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchContactRequest = () =>
  ({
    type: 'FETCH_CONTACT_REQUEST'
  } as const);

const fetchContactSuccess = (payload: IContact) =>
  ({
    type: 'FETCH_CONTACT_SUCCESS',
    payload
  } as const);

const fetchContactFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTACT_FAILURE',
    error
  } as const;
};

const shouldFetchContact = ({ contact: { isFetching } }: RootState) => !isFetching;

const fetchContact = (
  organizationId: string,
  siteId: string,
  contactId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchContactRequest());

    const response = await axios.get<IContact>(
      `/api/v2/organizations(${organizationId})/sites(${siteId})/contacts(${contactId})`
    );

    dispatch(fetchContactSuccess(response.data));
  } catch (error) {
    dispatch(fetchContactFailure(error));
  }
};

export const fetchContactIfNeeded = (
  organizationId: string,
  siteId: string,
  contactId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchContact(getState())) {
    dispatch(fetchContact(organizationId, siteId, contactId));
  }
};

export type Actions =
  | ReturnType<typeof fetchContactRequest>
  | ReturnType<typeof fetchContactSuccess>
  | ReturnType<typeof fetchContactFailure>;
