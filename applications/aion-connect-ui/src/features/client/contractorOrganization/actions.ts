import axios, { AxiosError } from 'axios';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchContractorOrganizationRequest = () =>
  ({
    type: 'FETCH_CONTRACTOR_ORGANIZATION_REQUEST'
  } as const);

export const fetchContractorOrganizationSuccess = (payload: IOrganization) =>
  ({
    type: 'FETCH_CONTRACTOR_ORGANIZATION_SUCCESS',
    payload
  } as const);

export const fetchContractorOrganizationFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTOR_ORGANIZATION_FAILURE',
    error
  } as const;
};

const shouldFetchOrganization = (state: RootState, organizationId: string) => {
  const {
    contractorOrganization: { isFetching, error, organization }
  } = state;

  return !isFetching && !error && (!organization || (organization && organization.id !== organizationId));
};

export const fetchContractorOrganization = (
  organizationId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchContractorOrganizationRequest());

    const { data } = await axios.get<IOrganization>(
      `/api/v3.00/organizations(${organizationId})?exposeLegacyId&includeClientFeatures=true`
    );

    dispatch(fetchContractorOrganizationSuccess(data));
  } catch (error) {
    dispatch(fetchContractorOrganizationFailure(error));
  }
};

export const fetchContractorOrganizationIfNeeded = (
  organizationId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchOrganization(getState(), organizationId)) {
    dispatch(fetchContractorOrganization(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchContractorOrganizationRequest>
  | ReturnType<typeof fetchContractorOrganizationSuccess>
  | ReturnType<typeof fetchContractorOrganizationFailure>;
