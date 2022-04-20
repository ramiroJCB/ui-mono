import axios, { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IContactInformation } from 'interfaces/contactInformation';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchContactInformationRequest = () =>
  ({
    type: 'FETCH_CONTACT_INFORMATION_REQUEST'
  } as const);

export const fetchContactInformationSuccess = (payload: IContactInformation | null) =>
  ({
    type: 'FETCH_CONTACT_INFORMATION_SUCCESS',
    payload
  } as const);

export const fetchContactInformationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTACT_INFORMATION_FAILURE',
    error
  } as const;
};

const shouldFetchContactInformation = (
  organizationId: string,
  { contactInformation: { contactInformation, isFetching } }: RootState
) =>
  (!contactInformation && !isFetching) || (contactInformation && organizationId !== contactInformation.organizationId);

export const fetchContactInformation = (
  organizationId: string
): ThunkAction<Promise<IContactInformation | void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchContactInformationRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .filter(({ filterBy }) => filterBy('type', Equals, 'Primary').filterBy('isDeleted', Equals, false))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: IContactInformation[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/contactInformation`,
        { params }
      );

      if (value.length) {
        dispatch(fetchContactInformationSuccess(value[0]));
        resolve(value[0]);
      } else {
        dispatch(fetchContactInformationSuccess(null));
        resolve();
      }
    } catch (error) {
      dispatch(fetchContactInformationFailure(error));
      reject(error);
    }
  });

export const fetchContactInformationIfNeeded = (
  organizationId: string
): ThunkAction<Promise<DeepReadonly<IContactInformation> | null>, RootState, null, Actions> => (dispatch, getState) =>
  new Promise(async resolve => {
    if (shouldFetchContactInformation(organizationId, getState())) {
      const data = await dispatch(fetchContactInformation(organizationId));

      if (data) {
        resolve(data);
      } else {
        resolve();
      }
    } else {
      const { contactInformation } = getState().contactInformation;
      resolve(contactInformation);
    }
  });

export type Actions =
  | ReturnType<typeof fetchContactInformationRequest>
  | ReturnType<typeof fetchContactInformationSuccess>
  | ReturnType<typeof fetchContactInformationFailure>;
