import axios, { AxiosError } from 'axios';
import { IContact } from 'interfaces/contact';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchContactsRequest = () =>
  ({
    type: 'FETCH_CONTACTS_REQUEST'
  } as const);

const fetchContactsSuccess = (payload: IContact[]) =>
  ({
    type: 'FETCH_CONTACTS_SUCCESS',
    payload
  } as const);

const fetchContactsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTACTS_FAILURE',
    error
  } as const;
};

const shouldFetchContacts = ({ contacts: { isFetching } }: RootState) => !isFetching;

const fetchContacts = (
  organizationId: string,
  siteId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchContactsRequest());

    const response = await axios.get<{ value: IContact[] }>(
      `/api/v2/organizations(${organizationId})/sites(${siteId})/contacts`
    );

    dispatch(fetchContactsSuccess(response.data.value));
  } catch (error) {
    dispatch(fetchContactsFailure(error));
  }
};

export const fetchContactsIfNeeded = (
  organizationId: string,
  siteId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchContacts(getState())) {
    dispatch(fetchContacts(organizationId, siteId));
  }
};

export type Actions =
  | ReturnType<typeof fetchContactsRequest>
  | ReturnType<typeof fetchContactsSuccess>
  | ReturnType<typeof fetchContactsFailure>;
